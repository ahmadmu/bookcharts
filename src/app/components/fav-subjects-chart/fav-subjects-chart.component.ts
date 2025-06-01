import { Component, inject } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VerticalBarChartComponent } from "../../shared/vertical-bar-chart/vertical-bar-chart.component";

@Component({
  selector: 'app-fav-subjects-chart',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    VerticalBarChartComponent
],
  templateUrl: './fav-subjects-chart.component.html',
  styleUrl: './fav-subjects-chart.component.scss'
})
export class FavSubjectsChartComponent {

  booksService = inject(BooksService);

  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 5;
}
