import { Injectable, computed, signal } from '@angular/core';
import { Book } from '../models/api.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  public readonly books = signal<Book[]>([]);

  readBooks = computed(() => this.books().filter(item => item.exclusiveShelf === 'read'));
  toReadBooks = computed(() => this.books().filter(item => item.exclusiveShelf === 'to-read'))
  currentlyReadingBooks = computed(() => this.books().filter(item => item.exclusiveShelf === 'currently-reading'))

  booksWithSubjects =  computed(() => this.readBooks().filter(item => item.subjects));
  booksWithoutSubject = computed(() => this.readBooks().filter(item => !item.subjects));
  
  constructor(private http: HttpClient) { }

  saveInLocalStorage() {
    console.log('saving in local storage', this.books())
    localStorage.setItem('data', JSON.stringify(this.books()));
  }

  getDemoCsv(): Observable<File> {
    return this.http.get<File>('assets/books.csv', {responseType: 'blob' as 'json'});
  }
}
