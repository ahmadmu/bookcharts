import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, Point } from 'chart.js';
import { tailwindColors } from '../../../../tailwind-colors';
import { NgStyle } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-monthly-reads-chart',
  standalone: true,
  imports: [FormsModule, NgStyle, BaseChartDirective],
  templateUrl: './monthly-reads-chart.component.html',
  styleUrls: ['./monthly-reads-chart.component.scss']
})
export class MonthlyReadsChartComponent {
  sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings'
  lowerLimit = 1;
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  booksService = inject(BooksService);
  filterByYear: string = '2024';
  
  filterOptions = [
    ...this.booksService.getYears()
  ]

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData!: ChartConfiguration<'bar'>['data'];

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'x',
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        padding: 12,
        animation: false,
        callbacks: {
          label: (_: any)=> '',
          beforeBody: (items: any) => `Month: ${this.monthNames[(items[0].raw as Point).x - 1] ?? 'Unknown'} \n${(items[0].raw as any).y} book(s): \n${(items[0].raw as any).books.join('\n')}`,
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
        ticks: {
          callback: (tickValue, index, ticks) => {
            console.log(tickValue)
            if (tickValue === 0) {
              return 'Unkown';
            }
            return this.monthNames[+tickValue-1]; 
          },
        }
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

  onYearChange() {
    this.initData()
  }

  ngOnInit() {
    this.initData();
  }

  initData() {
    let readBooks = this.booksService.readBooks().filter(book => +book.myRating > 0);

    const itemsMap = new Map<number, {books: string[]}>();
    readBooks
      .filter(book => book.dateRead.split('/')[0] === this.filterByYear)
      .forEach(book => {
        let month = book.dateRead.split('/')[1];
        const day = book.dateRead.split('/')[2];
        console.log(month, day)
        if (month === '01' && day === '01') {
          month = "00"
        }
        
        const oldValues = itemsMap.get(+month.trim()) ?? {books: []}
        
        itemsMap.set(+month.trim(), {
          books: [...oldValues.books, book.title.replace(/['"]+/g, '')]
        })
    })
    const amountOfBooksData = Array.from(itemsMap.entries())
      .map(entry => {
        const month = entry[0];
        const books = entry[1].books;
        return {
          x: month,
          y: books.length,
          books: entry[1].books
        }
      }
    )
    console.log(amountOfBooksData)
    this.barChartData = {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      datasets: [
        {data: amountOfBooksData as any, label: 'Amount of books', borderColor: tailwindColors.primary, backgroundColor: tailwindColors.primary},
    ]}
  }  
}
