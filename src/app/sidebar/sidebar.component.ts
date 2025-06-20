import { Component, computed, inject, signal } from '@angular/core';
import { OpenLibService } from '../services/open-lib.service';
import { BooksService } from '../services/books.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModalComponent } from "../shared/modal/modal.component";
import { Book } from '../models/api.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook, faChartSimple, faCheck, faCopy, faDownload, faFileImport, faList, faShuffle, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink, 
    RouterLinkActive, 
    ModalComponent,
    FontAwesomeModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  openLibService = inject(OpenLibService);
  booksService = inject(BooksService)

  clearModal = signal(false)

  hasData = computed(() => this.booksService.books().length > 0);

  faBook = faBook;
  faChartSimple = faChartSimple;
  faList = faList;
  faShuffle = faShuffle;
  faTrash = faTrash;

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
}
