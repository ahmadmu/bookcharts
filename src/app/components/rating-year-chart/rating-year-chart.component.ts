import { Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { BooksService } from '../../services/books.service';
import { ChartConfiguration, Point } from 'chart.js';
import { tailwindColors } from '../../../../tailwind-colors';

@Component({
  selector: 'app-rating-year-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './rating-year-chart.component.html',
  styleUrl: './rating-year-chart.component.scss'
})
export class RatingYearChartComponent {

  booksService = inject(BooksService);

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData!: ChartConfiguration<'line'>['data'];


  public barChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        padding: 12,
        animation: false,
        callbacks: {
          label: (_: any)=> '',
          beforeBody: (items: any) => `Year: ${(items[0].raw as Point).x}\nRating: ${(items[0].raw as Point).y}\n${(items[0].raw as any).title}`,
          labelPointStyle: undefined
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawOnChartArea: false,
        },
      },
      y: {
        grid: {
          display: true,
          drawOnChartArea: false,
          offset: false
        },
        beginAtZero: true
      }
    }
  };

  ngOnInit() {
    this.initData()
  }

  private initData() {
    const readBooks = this.booksService.readBooks();
    const yearMap = new Map<number, {myRatings: number[], avgRatings: number[]}>()
    readBooks.forEach(book => {
      const yearRead = +book.dateRead.split('/')[0].trim();
      const oldValues = yearMap.get(yearRead) ?? {myRatings: [], avgRatings: []}
      yearMap.set(yearRead, {
        myRatings: [...oldValues.myRatings, +book.myRating],
        avgRatings: [...oldValues.avgRatings, +book.avgRating]
      })
    })
    const myRatingData: any = [];
    const avgRatingData: any = [];
    Array.from(yearMap.entries())
      .sort((a,b) => a[0] > b[0] ? 1 : -1)
      .filter(entry => entry[0] !== 0)
      .forEach(entry => {
      const year = entry[0];
      const myRatings = entry[1].myRatings;
      const avgRatings = entry[1].avgRatings;
      myRatingData.push({
        x: year + ' (' + myRatings.length + ')',
        y: myRatings.reduce(this.reduceCallback, 0) / myRatings.length,
        count: myRatings.length
      })
      avgRatingData.push({
        x: year + ' (' + myRatings.length + ')',
        y: avgRatings.reduce(this.reduceCallback, 0) / avgRatings.length,
        count: avgRatings.length
      })
    })
    this.barChartData = {
      datasets: [
        {data: myRatingData, label: 'My Rating', borderColor: tailwindColors.primary, backgroundColor: tailwindColors.primary},
        {data: avgRatingData, label: 'Avg Rating', borderColor: tailwindColors.secondary, backgroundColor: tailwindColors.secondary}
    ]}
    console.log(this.barChartData)
  }

  private reduceCallback = (accumulator: number, currentValue: number) => accumulator + currentValue
}
