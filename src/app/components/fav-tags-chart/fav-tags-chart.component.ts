import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BooksService } from '../../services/books.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { tailwindColors } from '../../../../tailwind-colors';
import { VerticalBarChartComponent } from "../../shared/vertical-bar-chart/vertical-bar-chart.component";

@Component({
  selector: 'app-fav-tags-chart',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    VerticalBarChartComponent
],
  templateUrl: './fav-tags-chart.component.html',
  styleUrl: './fav-tags-chart.component.scss'
})
export class FavTagsChartComponent {

  booksService = inject(BooksService);
  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 0;
}
