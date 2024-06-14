import { Component, Pipe, PipeTransform, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataElement, DataHeader } from './models/api.model';
import { OpenApiDoc, OpenLibService } from './services/open-lib.service';
import { catchError, finalize, merge, of, tap } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './components/header/header.component';
import { BooksService } from './books.service';

@Pipe({
  name: 'imgUrl',
  standalone: true
})
export class ImgUrlPipe implements PipeTransform {

  transform(value: DataElement, size: 'S' | 'M' | 'L' = 'M') {
    const isbn =  value.isbn || value.isbn13;
    return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ImgUrlPipe,
    FontAwesomeModule,
    HeaderComponent
  ],
  providers: [OpenLibService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'book-charts';
  csvMetadata = {name: '', size: 0, type: ''}
  chunkSize = 15;
  withoutSubject = 0;

  openLibService = inject(OpenLibService);
  booksService = inject(BooksService)

  ngOnInit() {
    const storageData = localStorage.getItem('data');
    if (storageData) {
      this.booksService.books = JSON.parse(storageData)
      this.withoutSubject = this.booksService.books.filter(item => !item.subjects).length
    }
  }

  onImport(event: any) {
    const files = event.files;
    if (files && files.length > 0) {
      let file: File = files.item(0);
      this.csvMetadata = {
        name: file.name,
        size: file.size,
        type: file.type
      }

      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result as string;
        this.parseCSV(csv);
      }
    }
  }

  private parseCSV(csvText: string) {
    const commaOutsideOfQuoteRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
    const rows = csvText.split('\n')
    const headers: DataHeader[] = rows.shift()?.split(commaOutsideOfQuoteRegex) as DataHeader[] ?? [];
    const contentRows = rows.map(row => row.split(commaOutsideOfQuoteRegex));
    contentRows.forEach(contentRow => {
      const row: {[key in DataHeader]?: any} = {}
      headers.forEach((header: DataHeader, i) => {
        row[header] = contentRow[i];
      })
      this.booksService.books.push({
        additionalAuthors: row['Additional Authors'],
        author: row.Author,
        authorLf: row['Author l-f'],
        avgRating: row['Average Rating'],
        binding: row.Binding,
        bookId: row['Book Id'],
        bookshelves: row.Bookshelves,
        bookshelvesWithPosition: row['Bookshelves with positions'],
        dateAdded: row['Date Added'],
        dateRead: row['Date Read'],
        exclusiveShelf: row['Exclusive Shelf'],
        isbn: row.ISBN.replace(/['"]+/g, '').replace('=', ''),
        isbn13: row.ISBN13.replace(/['"]+/g, '').replace('=', ''),
        myRating: row['My Rating'],
        myReview: row['My Review'],
        numberOfPages: row['Number of Pages'],
        originalYearPublished: row['Original Publication Year'],
        ownedCopies: row['Owned Copies'],
        privateNotes: row['Private Notes'],
        publisher: row.Publisher,
        readCount: row['Read Count'],
        spoiler: row.Spoiler,
        title: row.Title,
        yearPublished: row['Year Published']
      })
    })
    this.saveInLocalStorage()
  }

  private saveInLocalStorage() {
    console.log('saving in local storage', this.booksService.books)
    this.withoutSubject = this.booksService.books.filter(item => !item.subjects).length;
    localStorage.setItem('data', JSON.stringify(this.booksService.books));
  }

  clear() {
    localStorage.removeItem('data');
    this.booksService.books = [];
  }

  private chunk(arr: any, size: number): string[][] {
    return arr.length > size
    ? [arr.slice(0, size), ...this.chunk(arr.slice(size), size)]
    : [arr];
  }

  fetchSubjectsWithIsbn() {
    const dataWithoutSubjects = this.booksService.books.filter(item => !item.subjects);
    const isbns = dataWithoutSubjects.map(item => item.isbn || item.isbn13).filter(isbn => isbn && isbn !== '');
    const chunkedIsbns = this.chunk(isbns, this.chunkSize);
    merge(
      ...chunkedIsbns.map(chunk => this.fetchChunkSubjectsWithIsbn(chunk))
    ).pipe(
      finalize(() => this.saveInLocalStorage())
    ).subscribe()
  }

  fetchSubjectsWithGrId() {
    const dataWithoutSubjects = this.booksService.books.filter(item => !item.subjects);
    const grIds = dataWithoutSubjects.map(item => item.bookId || item.bookId);
    const chunkedIds = this.chunk(grIds, this.chunkSize);
    merge(
      ...chunkedIds.map(chunk => this.fetchChunkSubjectsWithGrId(chunk))
    ).pipe(
      finalize(() => this.saveInLocalStorage())
    ).subscribe()
  }

  private fetchChunkSubjectsWithIsbn(ids: string[]) {
    return this.openLibService.fetchWorkFromOpenLibraryWithIsbn(ids)
      .pipe(
        tap(value =>
          value.docs.filter((doc:OpenApiDoc) => doc.subject)
            .forEach((doc:OpenApiDoc) => {
              const itemWithIdIndex = this.booksService.books.findIndex(
                item => doc.isbn.find(i => item.isbn.includes(i)) || doc.isbn.find(i => item.isbn.includes(i))
              );
              if (itemWithIdIndex > -1) {
                this.booksService.books[itemWithIdIndex].subjects = doc.subject;
              }
            })
        ),
        tap(() => {
          console.log('chunk completed', ids);
        }),
        catchError(error => {
          console.log('error in chunk', ids);
          console.error(error)
          return of([])
        })
      )
  }

  private fetchChunkSubjectsWithGrId(ids: string[]) {
    return this.openLibService.fetchWorkFromOpenLibraryWithGRId(ids)
      .pipe(
        tap(value =>
          value.docs.filter((doc:OpenApiDoc) => doc.subject)
            .forEach((doc:OpenApiDoc) => {
              const itemWithIdIndex = this.booksService.books.findIndex(
                item => doc.id_goodreads.find(id => item.bookId === id)
              );
              if (itemWithIdIndex > -1) {
                this.booksService.books[itemWithIdIndex].subjects = doc.subject;
              }
            })
        ),
        tap(() => {
          console.log('chunk completed', ids);
        }),
        catchError(error => {
          console.log('error in chunk', ids);
          console.error(error)
          return of([])
        })
      )
  }
}
