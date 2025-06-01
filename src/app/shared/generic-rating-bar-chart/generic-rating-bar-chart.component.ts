import { NgStyle } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ChartConfiguration, Point } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BooksService } from '../../services/books.service';
import { tailwindColors } from '../../../../tailwind-colors';
import { Book } from '../../models/api.model';

@Component({
  selector: 'app-generic-rating-bar-chart',
  imports: [    
    BaseChartDirective,
    NgStyle
  ],
  templateUrl: './generic-rating-bar-chart.component.html',
  styleUrl: './generic-rating-bar-chart.component.scss'
})
export class GenericRatingBarChart {

  @Input() attribute: keyof Book  = 'genres';
  @Input() lowerLimit = 1;
  @Input() tooltipCallback = (items: any) => `Rating: ${(items[0].raw as Point).x} \n${(items[0].raw as any).count} book(s): \n${(items[0].raw as any).books.join('\n')}`
  @Input() sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings';
  @Input() filterByYear: 'all' | string = 'all';

  booksService = inject(BooksService);

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData!: ChartConfiguration<'bar'>['data'];

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
          beforeBody: this.tooltipCallback,
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
        beginAtZero: true
      },
      y: {
        grid: {
          display: true,
          drawOnChartArea: false,
          offset: false
        },
        ticks: {  
          callback: (tickValue, index, ticks) => {
            const item = this.barChartData?.datasets?.[0]?.data?.[index] as any;
            const parts = item.y.split(' (');
            const count = ' (' + parts[parts.length-1];
            parts.pop();
            const joinedCategory = parts.join(' ') as string;
            const substringed = joinedCategory.substring(0, 20).trim() + (joinedCategory.length > 20 ? '...' : '');
            return substringed + count; 
          },
        }
      }
    }
  };

  ngOnChanges() {
    if (this.lowerLimit !== undefined && this.lowerLimit >= 0) {
      this.initData()
    }
  }

  ngOnInit() {
    this.initData()
  }

  initData() {
    let readBooks = this.booksService.readBooks().filter(book => +book.myRating > 0);
    if (this.filterByYear !== 'all') {
      readBooks = readBooks.filter(book => 
        book.dateRead &&
        book.dateRead !== undefined && 
        book.dateRead.split('/')[0].trim() === this.filterByYear
      )
    }
    const itemsMap = new Map<string, {myRatings: number[], avgRatings: number[], books: string[]}>();
    readBooks.forEach(book => {
      let items = []
      if (typeof book[this.attribute] === 'string') {
        items = (book[this.attribute] as string).replace(/['"]+/g, '').split(',');
      } else {
        const bookshelves = book[this.attribute] as string[] | undefined;
        items = bookshelves?.map(item => item.split(',')).flat() ?? [];
      }
      items.forEach((item: string) => {
        const oldValues = itemsMap.get(item.trim()) ?? {myRatings: [], avgRatings: [], books: []}
        itemsMap.set(item.trim(), {
          myRatings: [...oldValues.myRatings, +book.myRating],
          avgRatings: [...oldValues.avgRatings, +book.avgRating],
          books: [...oldValues.books, book.title.replace(/['"]+/g, '')]
        })
      })
    })
    const myRatingData: any = [];
    const avgRatingData: any = [];
    Array.from(itemsMap.entries())
      .filter(entry => entry[1].myRatings.length > this.lowerLimit)
      .forEach(entry => {
        const shelf = entry[0];
        const myRatings = entry[1].myRatings;
        const avgRatings = entry[1].avgRatings;
        myRatingData.push({
          y: shelf + ' (' + myRatings.length + ')',
          x: myRatings.reduce(this.reduceCallback, 0) / myRatings.length,
          avgRatings: avgRatings.reduce(this.reduceCallback, 0) / avgRatings.length,
          count: myRatings.length,
          books: entry[1].books
        })
        avgRatingData.push({
          y: shelf + ' (' + myRatings.length + ')',
          x: avgRatings.reduce(this.reduceCallback, 0) / avgRatings.length,
          count: avgRatings.length,
          books: entry[1].books
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
