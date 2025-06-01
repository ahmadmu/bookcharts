import { NgStyle } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ChartConfiguration, Point } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BooksService } from '../../services/books.service';
import { tailwindColors } from '../../../../tailwind-colors';
import { Book } from '../../models/api.model';

@Component({
  selector: 'app-vertical-bar-chart',
  imports: [    
    BaseChartDirective,
    NgStyle
  ],
  templateUrl: './vertical-bar-chart.component.html',
  styleUrl: './vertical-bar-chart.component.scss'
})
export class VerticalBarChartComponent {

  @Input() attribute: keyof Book  = 'genres';
  @Input() lowerLimit = 1;
  @Input() tooltipCallback = (items: any) => `${(items[0].raw as Point).x} \n${(items[0].raw as any).count} books`;
  @Input() sortBy: 'myRatings' | 'avgRatings' | 'amountOfBooks' = 'myRatings';

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
    const readBooks = this.booksService.readBooks().filter(book => +book.myRating > 0);
    const itemsMap = new Map<string, {myRatings: number[], avgRatings: number[]}>();
    readBooks.forEach(book => {
      let items = []
      if (typeof book[this.attribute] === 'string') {
        items = (book[this.attribute] as string).replace(/['"]+/g, '').split(',');
      } else {
        const bookshelves = book[this.attribute] as string[] | undefined;
        items = bookshelves?.map(item => item.split(',')).flat() ?? [];
      }
      items.forEach((item: string) => {
        const oldValues = itemsMap.get(item.trim()) ?? {myRatings: [], avgRatings: []}
        itemsMap.set(item.trim(), {
          myRatings: [...oldValues.myRatings, +book.myRating],
          avgRatings: [...oldValues.avgRatings, +book.avgRating]
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
