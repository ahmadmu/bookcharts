import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VerticalBarChartComponent } from "../../shared/vertical-bar-chart/vertical-bar-chart.component";

@Component({
  selector: 'app-fav-author-chart',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    VerticalBarChartComponent
  ],
  templateUrl: './fav-author-chart.component.html',
  styleUrl: './fav-author-chart.component.scss'
})
export class FavAuthorChartComponent {
  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 1;
}
