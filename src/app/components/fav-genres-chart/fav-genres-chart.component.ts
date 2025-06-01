import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenericRatingBarChart } from "../../shared/generic-rating-bar-chart/generic-rating-bar-chart.component";
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-fav-genres-chart',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    GenericRatingBarChart
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
}
