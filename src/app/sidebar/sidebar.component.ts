import { Component, inject, signal } from '@angular/core';
import { OpenApiDoc, OpenLibService } from '../services/open-lib.service';
import { BooksService } from '../services/books.service';
import { catchError, finalize, merge, of, tap } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModalComponent } from "../shared/modal/modal.component";
import { Book } from '../models/api.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook, faChartBar, faChartSimple, faCheck, faCopy, faDownload, faFileImport, faList, faShuffle, faTable, faTableList, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink, 
    RouterLinkActive, 
    ModalComponent,
    FontAwesomeModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  openLibService = inject(OpenLibService);
  booksService = inject(BooksService)

  clearModal = signal(false)
  importGenresModal = signal(false)

  csvMetadata = {name: '', size: 0, type: ''}

  faBook = faBook;
  faChartSimple = faChartSimple;
  faList = faList;
  faShuffle = faShuffle;
  faDownload = faDownload;
  faFileImport = faFileImport;
  faTrash = faTrash;
  faCopy = faCopy;
  faCheck = faCheck;

  copyStatus: 'done' | string = 'Copy prompt to clipboard';

  ngOnInit() {
    const storageData = localStorage.getItem('data');
    if (storageData) {
      this.booksService.books.set(JSON.parse(storageData))
    }
  }

  clear() {
    localStorage.removeItem('data');
    this.booksService.books.set([]);
  }

  exportTitleAndIds() {
    const titles = this.booksService.books().map(item => ({title: item.title}))
    const header = ['Title', 'Genres'].join(';').concat('\n');
    const csvContent = titles.map(item => item.title + ';').join('\n');

    const BOM = "\uFEFF";
    const data = BOM + header.concat(csvContent);
    const blob = new Blob([data], { type: 'data:text/csv;charset=utf-8' })
    var link = document.createElement('a');
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "book_titles.csv");
    document.body.appendChild(link);

    link.click();
  }

  onGenresImport(event: any) {
    const file = event.files.item(0);
    this.readFile(file!!);
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
      this.parseCsv(csv);
    }
  }

  parseCsv(csvText: string) {
    const commaOutsideOfQuoteRegex = /;(?=(?:(?:[^"]*"){2})*[^"]*$)/
    const rows = csvText.split('\n')
    rows.shift();
    const contentRows = rows.map(row => row.split(commaOutsideOfQuoteRegex));
    const books = this.booksService.books();
    books.forEach((book: Book) => {
      contentRows.forEach(contentRow => { 
        if (book.title === contentRow[0]) {
          book.genres = contentRow[1].split(',').map(genre => genre.trim());
        }
      })
    })
    this.booksService.books.set(books);
    this.booksService.saveInLocalStorage();
    this.importGenresModal.set(false);
  }

  copyPromptToClipboard() {
    const prompt = 'create a new semicolon separated csv based on the attached csv, and fill the genres field with the genres of each book';
    navigator.clipboard.writeText(prompt).then(() => {
      this.copyStatus = 'Copied!';
    }).catch(err => {
      this.copyStatus = 'Failed to copy prompt. Please try again.';
      console.error('Failed to copy prompt: ', err);
    });
    setTimeout(() => {
      this.copyStatus = 'Copy prompt to clipboard';
    }, 5000);
  }
}
