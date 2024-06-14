import { Injectable, computed, signal } from '@angular/core';
import { DataElement } from './models/api.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private _books = signal<DataElement[]>([]);

  set books(books: DataElement[]) {
    this._books.set(books);
  }

  get books(): DataElement[] {
    return this._books();
  }

  readBooks = computed(() => this.books.filter(item => item.exclusiveShelf === 'read'));
  toReadBooks = computed(() => this.books.filter(item => item.exclusiveShelf === 'to-read'))
  currentlyReadingBooks = computed(() => this.books.filter(item => item.exclusiveShelf === 'currently-reading'))

  booksWithSubjects =  computed(() => this.readBooks().filter(item => item.subjects));
  constructor() { }
}
