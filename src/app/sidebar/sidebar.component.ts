import { Component, inject } from '@angular/core';
import { OpenApiDoc, OpenLibService } from '../services/open-lib.service';
import { BooksService } from '../books.service';
import { catchError, finalize, merge, of, tap } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  openLibService = inject(OpenLibService);
  booksService = inject(BooksService)
  withoutSubject = 0;
  chunkSize = 15;

  ngOnInit() {
    const storageData = localStorage.getItem('data');
    if (storageData) {
      this.booksService.books = JSON.parse(storageData)
      this.withoutSubject = this.booksService.books.filter(item => !item.subjects).length
    }
  }

  private chunk(arr: any, size: number): string[][] {
    return arr.length > size
    ? [arr.slice(0, size), ...this.chunk(arr.slice(size), size)]
    : [arr];
  }

  clear() {
    localStorage.removeItem('data');
    this.booksService.books = [];
  }

  private saveInLocalStorage() {
    console.log('saving in local storage', this.booksService.books)
    this.withoutSubject = this.booksService.books.filter(item => !item.subjects).length;
    localStorage.setItem('data', JSON.stringify(this.booksService.books));
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

  exportTitleAndIds() {
    const titles = this.booksService.books.map(item => ({title: item.title}))
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
