import { Component, Pipe, PipeTransform, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Book } from './models/api.model';
import { OpenLibService } from './services/open-lib.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BooksService } from './services/books.service';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ImportComponent } from "./components/import/import.component";

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
    SidebarComponent,
    ImportComponent
],
  providers: [OpenLibService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  booksService = inject(BooksService)
}
