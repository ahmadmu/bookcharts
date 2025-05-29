import { Injectable, computed, signal } from '@angular/core';
import { Book } from './models/api.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private _books = signal<Book[]>([]);

  set books(books: Book[]) {
    this._books.set(books);
  }

  get books(): Book[] {
    return this._books();
  }

  readBooks = computed(() => this.books.filter(item => item.exclusiveShelf === 'read'));
  toReadBooks = computed(() => this.books.filter(item => item.exclusiveShelf === 'to-read'))
  currentlyReadingBooks = computed(() => this.books.filter(item => item.exclusiveShelf === 'currently-reading'))

  booksWithSubjects =  computed(() => this.readBooks().filter(item => item.subjects));
  constructor() { }
}
