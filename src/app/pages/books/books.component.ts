import { Component, inject } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { Book } from '../../models/api.model';
import { NgStyle } from '@angular/common';

type TableHead = {
  key: keyof Book;
  text: string;
  width: string;
}

@Component({
  selector: 'app-books',
  imports: [NgStyle],
  templateUrl: `./books.component.html`,
  styleUrl: './books.component.scss',
})
export class BooksComponent { 
  booksService = inject(BooksService);

  books = this.booksService.books();

  heads: TableHead[] = [
    { key: 'title', text: 'Title', width: '150px' },
    { key: 'author', text: 'Author', width: '150px' },
    { key: 'myRating', text: 'Rating', width: '80px' },
    { key: 'yearPublished', text: 'Date Published', width: '50px' },
    { key: 'dateRead', text: 'Date Read', width: '100px' },
    { key: 'bookshelves', text: 'Bookshelves', width: '100px' },
    { key: 'genres', text: 'Genres', width: '100px' },
    { key: 'subjects', text: 'Subjects', width: '50px' },
    { key: 'exclusiveShelf', text: 'Exclusive Shelf', width: '50px' },
  ]
}
