import { Component, inject } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { ChartConfiguration, Point } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { tailwindColors } from '../../../../tailwind-colors';

@Component({
  selector: 'app-fav-genres-chart',
  standalone: true,
  imports: [
    BaseChartDirective,
    FontAwesomeModule,
    FormsModule
  ],
  templateUrl: './fav-genres-chart.component.html',
  styleUrl: './fav-genres-chart.component.scss'
})
export class FavGenresChartComponent {

  booksService = inject(BooksService);

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData!: ChartConfiguration<'bar'>['data'];
  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 5;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        padding: 12,
        animation: false,
        callbacks: {
          label: (_: any)=> '',
          beforeBody: (items: any) => `${(items[0].raw as Point).x} \n${(items[0].raw as any).count} books`,
          labelPointStyle: undefined
        }
      }
    },
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
    const genresMap = new Map<string, {myRatings: number[], avgRatings: number[]}>();
    readBooks.forEach(book => {
      const bookshelves = book.genres;
      bookshelves?.map(genre => genre.split(',')).flat().forEach((genre: string) => {
        const oldValues = genresMap.get(genre.trim()) ?? {myRatings: [], avgRatings: []}
        genresMap.set(genre.trim(), {
          myRatings: [...oldValues.myRatings, +book.myRating],
          avgRatings: [...oldValues.avgRatings, +book.avgRating]
        })
      })
    })
    const myRatingData: any = [];
    const avgRatingData: any = [];
    Array.from(genresMap.entries())
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
          count: avgRatings.length
        })
      }
    )
    if (this.sortBy === 'myRatings') myRatingData.sort((a: any,b: any) => a.x > b.x ? -1 : 1);
    if (this.sortBy === 'avgRatings') myRatingData.sort((a: any,b: any) => a.avgRatings > b.avgRatings ? -1 : 1);
    if (this.sortBy === 'amountOfBooks') myRatingData.sort((a: any, b: any) => a.count > b.count ? -1 : 1);
    this.barChartData = {
      datasets: [
      {data: myRatingData, label: 'My Rating', borderColor: tailwindColors.primary, backgroundColor: tailwindColors.primary},
      {data: avgRatingData, label: 'Avg Rating', borderColor: tailwindColors.secondary, backgroundColor: tailwindColors.secondary}
    ]}
  }

  private reduceCallback = (accumulator: number, currentValue: number) => accumulator + currentValue
}
