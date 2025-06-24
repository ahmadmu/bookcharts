import { Component, Signal, computed, inject, signal } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { FavTagsChartComponent } from '../../components/fav-tags-chart/fav-tags-chart.component';
import { FavAuthorChartComponent } from '../../components/fav-author-chart/fav-author-chart.component';
import { FavSubjectsChartComponent } from '../../components/fav-subjects-chart/fav-subjects-chart.component';
import { RatingYearChartComponent } from '../../components/rating-year-chart/rating-year-chart.component';
import { RatingYearPublishedChartComponent } from '../../components/rating-year-published-chart/rating-year-published-chart.component';
import { RatingPageCountChartComponent } from '../../components/rating-page-count-chart/rating-page-count-chart.component';
import { FavGenresChartComponent } from '../../components/fav-genres-chart/fav-genres-chart.component';
import { MonthlyReadsChartComponent } from "../../components/monthly-reads-chart/monthly-reads-chart.component";

export type ChartType = 'favTags' | 'favSubjects' | 'favGenres' | 'favAuthor' | 'ratingVsPageCount' | 'ratingVsYear' | 'ratingVsYearPublished' | 'monthlyCharts';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    FavTagsChartComponent,
    FavAuthorChartComponent,
    FavSubjectsChartComponent,
    FavGenresChartComponent,
    RatingYearChartComponent,
    RatingYearPublishedChartComponent,
    RatingPageCountChartComponent,
    MonthlyReadsChartComponent
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
    { value: 'favGenres', text: 'Favorite Genres' },
    { value: 'favAuthor', text: 'Favorite Author'},
    { value: 'ratingVsPageCount', text: 'Rating vs Page Count'},
    { value: 'ratingVsYear', text: 'Rating over Time'},
    { value: 'ratingVsYearPublished', text: 'Rating vs Year Published'},
    { value: 'monthlyCharts', text: 'Monthly Reads'}
  ]

  ngOnInit() {
    const storedCharts = localStorage.getItem('charts');
    if (storedCharts) {
      const parsedCharts: ChartType[] = JSON.parse(storedCharts);
      this.charts = parsedCharts.map(c => signal(c));
    } else {
      this.charts = [signal('favTags'), signal('favSubjects')];
    }
  }

  onChartChange() {
    this.saveInLocalStorage();
  }

  saveInLocalStorage() {
    localStorage.setItem('charts', JSON.stringify(this.charts.map(c => c())));
  }
}
