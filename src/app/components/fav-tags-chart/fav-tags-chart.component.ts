import { Component, ViewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BooksService } from '../../books.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fav-tags-chart',
  standalone: true,
  imports: [
    BaseChartDirective,
    FontAwesomeModule,
    FormsModule
  ],
  templateUrl: './fav-tags-chart.component.html',
  styleUrl: './fav-tags-chart.component.scss'
})
export class FavTagsChartComponent {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  booksService = inject(BooksService);
  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 0;
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData!: ChartConfiguration<'bar'>['data'];


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    maintainAspectRatio: false,
    scales: {
      x: {
        position: 'top',
        grid: {
          display: true,
          drawOnChartArea: false,
        },
        beginAtZero: true,
      },
      y: {
        grid: {
          display: true,
          drawOnChartArea: false,
          offset: false
        }
      }
    }
  };

  ngOnInit() {
    this.initData()
  }

  update() {
    this.initData()
  }

  initData() {
    const readBooks = this.booksService.readBooks().filter(book => +book.myRating > 0);
    const tagsMap = new Map<string, {myRatings: number[], avgRatings: number[]}>();
    readBooks.forEach(book => {
      const bookshelves = book.bookshelves.replace(/['"]+/g, '');
      bookshelves.split(',').forEach(shelf => {
        const oldValues = tagsMap.get(shelf.trim()) ?? {myRatings: [], avgRatings: []}
        tagsMap.set(shelf.trim(), {
          myRatings: [...oldValues.myRatings, +book.myRating],
          avgRatings: [...oldValues.avgRatings, +book.avgRating]
        })
      })
    })
    const myRatingData: any = [];
    const avgRatingData: any = [];
    Array.from(tagsMap.entries())
      .filter(entry => entry[1].myRatings.length > this.lowerLimit)
      .forEach(entry => {
      const shelf = entry[0];
      const myRatings = entry[1].myRatings;
      const avgRatings = entry[1].avgRatings;
      myRatingData.push({
        y: shelf + ' (' + myRatings.length + ')',
        x: myRatings.reduce(this.reduceCallback, 0) / myRatings.length,
        avgRatings: avgRatings.reduce(this.reduceCallback, 0) / avgRatings.length,
        count: myRatings.length
      })
      avgRatingData.push({
        y: shelf + ' (' + myRatings.length + ')',
        x: avgRatings.reduce(this.reduceCallback, 0) / avgRatings.length,
        myRatings: myRatings.reduce(this.reduceCallback, 0) / myRatings.length,
        count: avgRatings.length
      })
    })
    if (this.sortBy === 'myRatings') myRatingData.sort((a: any,b: any) => a.x > b.x ? -1 : 1);
    if (this.sortBy === 'avgRatings') myRatingData.sort((a: any,b: any) => a.avgRatings > b.avgRatings ? -1 : 1);
    if (this.sortBy === 'amountOfBooks') myRatingData.sort((a: any, b: any) => a.count > b.count ? -1 : 1);
    this.barChartData = {
      datasets: [
        {data: myRatingData, label: 'My Rating', borderColor: '#CC7666', backgroundColor: '#CC7666'},
        {data: avgRatingData, label: 'Avg Rating', borderColor: '#66BCCC', backgroundColor: '#66BCCC'}
      ]
    }
  }

  private reduceCallback = (accumulator: number, currentValue: number) => accumulator + currentValue
}
