import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenericRatingBarChart } from "../../shared/generic-rating-bar-chart/generic-rating-bar-chart.component";
import { BooksService } from '../../services/books.service';
import { faCheck, faCopy, faDownload, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { Book } from '../../models/api.model';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-fav-genres-chart',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    GenericRatingBarChart,
    ModalComponent,
    FontAwesomeModule
  ],
  templateUrl: './fav-genres-chart.component.html',
  styleUrl: './fav-genres-chart.component.scss'
})
export class FavGenresChartComponent {
  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 5;

  booksService = inject(BooksService);
  filterByYear: 'all' | string = 'all'
  
  filterOptions = [
    'all',
    ...this.booksService.getYears()
  ]

  copyStatus: 'done' | string = 'Copy prompt to clipboard';
  faCopy = faCopy;
  faCheck = faCheck;
  faDownload = faDownload;
  faFileImport = faFileImport;

  importGenresModal = signal(false)
  csvMetadata = {name: '', size: 0, type: ''}

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

  exportTitleAndIds(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
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

  copyPromptToClipboard(event: Event) {
    event.preventDefault();
    event.stopPropagation();
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
