import { Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { BooksService } from '../../books.service';
import { ChartConfiguration, Point } from 'chart.js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating-year-published-chart',
  standalone: true,
  imports: [
    BaseChartDirective,
    FontAwesomeModule,
    FormsModule
],
  templateUrl: './rating-year-published-chart.component.html',
  styleUrl: './rating-year-published-chart.component.scss'
})
export class RatingYearPublishedChartComponent {

  booksService = inject(BooksService);

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData!: ChartConfiguration<'scatter'>['data'];
  lowerLimit = -2000;

  public barChartOptions: ChartConfiguration<'scatter'>['options'] = {
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
        max: 2024
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
      .filter(book =>
        book.originalYearPublished &&
        book.yearPublished &&
        +book.originalYearPublished > this.lowerLimit
      );
    this.barChartData = {
      datasets: [
        {
          data: readBooks.map(book => ({
            y: book.myRating,
            x: book.originalYearPublished ?? book.yearPublished,
            title: book.title.replace(/['"]+/g, '').substring(0,40)
          })) as any,
          label: 'My Ratings',
          borderColor: '#CC7666',
          backgroundColor: '#CC7666'
        },
        {
          data: readBooks.map(book => ({
            y: book.avgRating,
            x: book.originalYearPublished ?? book.yearPublished,
            title: book.title.replace(/['"]+/g, '').substring(0,40)
          })) as any,
          label: 'Avg Ratings',
          borderColor: '#66BCCC',
          backgroundColor: '#66BCCC'
        }
      ]
    }
  }
}
