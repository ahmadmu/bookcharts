import { BooksService } from './../../services/books.service';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenericRatingBarChart } from "../../shared/generic-rating-bar-chart/generic-rating-bar-chart.component";

@Component({
  selector: 'app-fav-author-chart',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    GenericRatingBarChart
],
  templateUrl: './fav-author-chart.component.html',
  styleUrl: './fav-author-chart.component.scss'
})
export class FavAuthorChartComponent {
  
  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 1;
  
  booksService = inject(BooksService);
  filterByYear: 'all' | string = 'all'
  
  filterOptions = [
    'all',
    ...this.booksService.getYears()
  ]
}
