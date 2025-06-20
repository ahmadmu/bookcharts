import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { OpenApiDoc, OpenLibService } from '../../services/open-lib.service';
import { BooksService } from '../../services/books.service';
import { Book, BookHeader } from '../../models/api.model';
import { catchError, of, tap, merge, switchMap, delay, finalize } from 'rxjs';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { NgIf } from '@angular/common';


type ImportPhase = 'initial' | 'isbns' | 'ids' | 'completed';
@Component({
  selector: 'app-import',
  imports: [LottieComponent, NgIf],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss'
})
export class ImportComponent {
  options: AnimationOptions = {
    path: './assets/bookloading.json'
  };

  csvMetadata = {name: '', size: 0, type: ''}
  draggedOver = false;
  chunkSize = 15;

  openLibService = inject(OpenLibService);
  booksService = inject(BooksService)

  importing = false;
  importPhase: ImportPhase = 'initial';

  onImport(event?: any) {
    this.importing = true
    if (event && event.files && event.files.length > 0) {
      const file = event.files.item(0);
      this.readFile(file!!);
    } else {
      this.booksService.getDemoCsv().subscribe({
        next: (file: File) => {
          this.readFile(file);
        },
        error: (err) => {
          console.error('Error fetching demo CSV:', err);
        }
      });
    }
  }

  readFile(file: File) {
    this.csvMetadata = {
      name: file.name,
      size: file.size,
      type: file.type
    }

    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      let csv: string = reader.result as string;
      this.importing = true;
      this.importPhase = 'initial';
      this.parseCSV(csv).pipe(
        delay(2000),
        tap(() => this.importPhase = 'isbns'),
        switchMap(
          books => this.fetchSubjectsWithIsbn(books).pipe(
            delay(5000),
            tap(() => this.importPhase = 'ids'),
            switchMap(() => this.fetchSubjectsWithGrId(books)),
            delay(5000),
            tap(() => this.importPhase = 'completed'),
            delay(3000),
            finalize(() => {
              this.importing = false;
              this.booksService.books.set(books);
              this.booksService.saveInLocalStorage();
              console.log('Import completed successfully');
            })
          )
        ),
        catchError((error) => {
          console.error('Error during CSV parsing or fetching subjects:', error);
          this.importing = false;
          this.importPhase = 'completed';
          return of([]);
        })
      )
      .subscribe()
    }
  }

  private parseCSV(csvText: string) {
    const commaOutsideOfQuoteRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
    const rows = csvText.split('\n')
    const headers: BookHeader[] = rows.shift()?.split(commaOutsideOfQuoteRegex) as BookHeader[] ?? [];
    const contentRows = rows.map(row => row.split(commaOutsideOfQuoteRegex));
    const books = [] as Book[];
    contentRows.forEach(contentRow => {
      const row: {[key in BookHeader]?: any} = {}
      headers.forEach((header: BookHeader, i) => {
        row[header] = contentRow[i];
      })
      if (contentRow.length !== headers.length) return;
      books.push({
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
    return of(books);
  }

  private chunk(arr: any, size: number): string[][] {
    return arr.length > size
    ? [arr.slice(0, size), ...this.chunk(arr.slice(size), size)]
    : [arr];
  }

  fetchSubjectsWithIsbn(books: Book[]) {
    const dataWithoutSubjects = books.filter(item => !item.subjects);
    if (dataWithoutSubjects.length === 0) return of([])

    const isbns = dataWithoutSubjects.map(item => item.isbn || item.isbn13).filter(isbn => isbn && isbn !== '');
    const chunkedIsbns = this.chunk(isbns, this.chunkSize);
    return merge(
      ...chunkedIsbns.map(chunk => this.fetchChunkSubjectsWithIsbn(chunk, books))
    )
  }

  fetchSubjectsWithGrId(books: Book[]) {
    const dataWithoutSubjects = this.booksService.books().filter(item => !item.subjects);
    if (dataWithoutSubjects.length === 0) return of([])

    const grIds = dataWithoutSubjects.map(item => item.bookId || item.bookId);
    const chunkedIds = this.chunk(grIds, this.chunkSize);
    return merge(
      ...chunkedIds.map(chunk => this.fetchChunkSubjectsWithGrId(chunk, books))
    )
  }

  private fetchChunkSubjectsWithIsbn(ids: string[], books: Book[]) {
    return this.openLibService.fetchWorkFromOpenLibraryWithIsbn(ids)
      .pipe(
        tap(value =>
          value.docs.filter((doc:OpenApiDoc) => doc.subject)
            .forEach((doc:OpenApiDoc) => {
              const itemWithIdIndex = books.findIndex(
                item => doc.isbn.find(i => item.isbn.includes(i)) || doc.isbn.find(i => item.isbn.includes(i))
              );
              if (itemWithIdIndex > -1) {
                books[itemWithIdIndex].subjects = doc.subject;
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

  private fetchChunkSubjectsWithGrId(ids: string[], books: Book[]) {
    return this.openLibService.fetchWorkFromOpenLibraryWithGRId(ids)
      .pipe(
        tap(value =>
          value.docs.filter((doc:OpenApiDoc) => doc.subject)
            .forEach((doc:OpenApiDoc) => {
              const itemWithIdIndex = books.findIndex(
                item => doc.id_goodreads.find(id => item.bookId === id)
              );
              if (itemWithIdIndex > -1) {
                books[itemWithIdIndex].subjects = doc.subject;
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
