import { Component, Signal, computed, inject, signal } from '@angular/core';
import { BooksService } from '../../books.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { FavTagsChartComponent } from '../fav-tags-chart/fav-tags-chart.component';
import { FavAuthorChartComponent } from '../fav-author-chart/fav-author-chart.component';
import { FavSubjectsChartComponent } from '../fav-subjects-chart/fav-subjects-chart.component';
import { RatingYearChartComponent } from '../rating-year-chart/rating-year-chart.component';
import { RatingYearPublishedChartComponent } from '../rating-year-published-chart/rating-year-published-chart.component';
import { RatingPageCountChartComponent } from '../rating-page-count-chart/rating-page-count-chart.component';

export type ChartType = 'favTags' | 'favSubjects' | 'favAuthor' | 'ratingVsPageCount' | 'ratingVsYear' | 'ratingVsYearPublished';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    FavTagsChartComponent,
    FavAuthorChartComponent,
    FavSubjectsChartComponent,
    RatingYearChartComponent,
    RatingYearPublishedChartComponent,
    RatingPageCountChartComponent
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent {

  booksService = inject(BooksService);
  faCaretDown = faCaretDown;

  charts: Signal<ChartType>[] = [
    signal('favTags'),
    signal('favSubjects')
  ]

  chart1Item = computed(() => this.ddItems.find(item => item.value === this.charts[0]()))
  chart2Item = computed(() => this.ddItems.find(item => item.value === this.charts[1]()))

  ddItems: {value: ChartType, text: string }[] = [
    { value: 'favTags', text: 'Favorite Tags'},
    { value: 'favSubjects', text: 'Favorite Subjects' },
    { value: 'favAuthor', text: 'Favorite Author'},
    { value: 'ratingVsPageCount', text: 'Rating vs Page Count'},
    { value: 'ratingVsYear', text: 'Rating over Time'},
    { value: 'ratingVsYearPublished', text: 'Rating vs Year Published'}
  ]
}
