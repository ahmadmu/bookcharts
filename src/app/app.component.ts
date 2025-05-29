import { Component, Pipe, PipeTransform, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Book, BookHeader } from './models/api.model';
import { OpenLibService } from './services/open-lib.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BooksService } from './books.service';
import { SidebarComponent } from "./sidebar/sidebar.component";

@Pipe({
  name: 'imgUrl',
  standalone: true,
})
export class ImgUrlPipe implements PipeTransform {

  transform(value: Book, size: 'S' | 'M' | 'L' = 'M') {
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
    SidebarComponent
],
  providers: [OpenLibService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'book-charts';
  csvMetadata = {name: '', size: 0, type: ''}

  openLibService = inject(OpenLibService);
  booksService = inject(BooksService)

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
    const headers: BookHeader[] = rows.shift()?.split(commaOutsideOfQuoteRegex) as BookHeader[] ?? [];
    const contentRows = rows.map(row => row.split(commaOutsideOfQuoteRegex));
    contentRows.forEach(contentRow => {
      const row: {[key in BookHeader]?: any} = {}
      headers.forEach((header: BookHeader, i) => {
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
    localStorage.setItem('data', JSON.stringify(this.booksService.books));
  }

}
