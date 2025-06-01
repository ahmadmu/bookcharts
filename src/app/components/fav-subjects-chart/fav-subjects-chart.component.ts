import { Component, inject } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenericRatingBarChart } from "../../shared/generic-rating-bar-chart/generic-rating-bar-chart.component";

@Component({
  selector: 'app-fav-subjects-chart',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    GenericRatingBarChart
],
  templateUrl: './fav-subjects-chart.component.html',
  styleUrl: './fav-subjects-chart.component.scss'
})
export class FavSubjectsChartComponent {

  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 5;

  booksService = inject(BooksService);
  filterByYear: 'all' | string = 'all'
  
  filterOptions = [
    'all',
    ...this.booksService.getYears()
  ]
}
