import { Component, ViewChild, inject } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { GenericRatingBarChart } from "../../shared/generic-rating-bar-chart/generic-rating-bar-chart.component";

@Component({
  selector: 'app-fav-tags-chart',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    GenericRatingBarChart
],
  templateUrl: './fav-tags-chart.component.html',
  styleUrl: './fav-tags-chart.component.scss'
})
export class FavTagsChartComponent {

  booksService = inject(BooksService);
  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 0;
}
