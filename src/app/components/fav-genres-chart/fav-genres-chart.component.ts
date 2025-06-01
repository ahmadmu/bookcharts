import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VerticalBarChartComponent } from "../../shared/vertical-bar-chart/vertical-bar-chart.component";

@Component({
  selector: 'app-fav-genres-chart',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    VerticalBarChartComponent
],
  templateUrl: './fav-genres-chart.component.html',
  styleUrl: './fav-genres-chart.component.scss'
})
export class FavGenresChartComponent {
  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 5;
}
