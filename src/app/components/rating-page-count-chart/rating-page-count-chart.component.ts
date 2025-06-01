import { Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { BooksService } from '../../services/books.service';
import { ChartConfiguration, Point } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { tailwindColors } from '../../../../tailwind-colors';

@Component({
  selector: 'app-rating-page-count-chart',
  standalone: true,
  imports: [
    BaseChartDirective,
    FontAwesomeModule,
    FormsModule
  ],
  templateUrl: './rating-page-count-chart.component.html',
  styleUrl: './rating-page-count-chart.component.scss'
})
export class RatingPageCountChartComponent {

  booksService = inject(BooksService);

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData!: ChartConfiguration<'scatter'>['data'];
  upperLimit = 10000;

  public barChartOptions: ChartConfiguration<'scatter'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        padding: 12,
        animation: false,
        callbacks: {
          label: (_: any)=> '',
          beforeBody: (items: any) => `${(items[0].raw as Point).x} pages\n${(items[0].raw as Point).y}\n${(items[0].raw as any).title}`,
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
        beginAtZero: true,
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

  update() {
    this.initData()
  }

  private initData() {
    const readBooks = this.booksService.readBooks()
      .filter(book => +book.numberOfPages < this.upperLimit);
    this.barChartData = {
      datasets: [
        {
          data: readBooks.map(book => ({
            y: book.myRating,
            x: book.numberOfPages,
            title: book.title.replace(/['"]+/g, '').substring(0,40)
          })) as any,
          label: 'My Ratings',
          borderColor: tailwindColors.primary,
          backgroundColor: tailwindColors.primary
        },
        {
          data: readBooks.map(book => ({
            y: book.avgRating,
            x: book.numberOfPages,
            title: book.title.replace(/['"]+/g, '').substring(0,40)
          })) as any,
          label: 'Avg Ratings',
          borderColor: tailwindColors.secondary,
          backgroundColor: tailwindColors.secondary
        }
      ]
    }
  }
}
