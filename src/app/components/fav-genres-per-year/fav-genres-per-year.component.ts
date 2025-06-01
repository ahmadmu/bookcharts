import { Component, inject } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { ChartConfiguration, Point } from 'chart.js';
import { tailwindColors } from '../../../../tailwind-colors';
import { BaseChartDirective } from 'ng2-charts';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/api.model';

@Component({
  selector: 'app-fav-genres-per-year',
  imports: [
    BaseChartDirective,
    NgStyle,
    FormsModule
  ],
  templateUrl: './fav-genres-per-year.component.html',
  styleUrl: './fav-genres-per-year.component.scss'
})
export class FavGenresPerYearComponent {

  filterBy: number = 2020;
  sortBy: 'myAvgRating' | 'amountOfBooks' = 'myAvgRating'
  lowerLimit = 1;

  booksService = inject(BooksService);

  filterOptions: any[] = []

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
          beforeBody: (items: any) => `${(items[0].raw as Point).x} \n${(items[0].raw as any).count} books: \n${(items[0].raw as any).books.join('\n')}`,
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

  ngOnInit() {
    const years = this.booksService.readBooks().map(book => {
      if (book.dateRead && book.dateRead !== "") {
        return +book.dateRead.split('/')[0].trim();
      }
      return undefined
    }).filter(year => year !== undefined);
    this.filterOptions = Array.from(new Set(years))
      .sort((a, b) => a!! - b!!);
    this.initData()
  }

  update() {
    this.initData()
  }

  initData() {
    const readBooks = this.booksService.readBooks().filter(book => 
      +book.myRating > 0 &&
      book.dateRead &&
      book.dateRead !== "" && 
      +book.dateRead.split('/')[0].trim() === +this.filterBy
    );
    const itemsMap = new Map<string, {amount: number, totalRating: number, books: string[]}>();
    readBooks.forEach(book => {
        book.genres?.forEach((genre: string) => {
          const oldValue = itemsMap.get(genre.trim()) ?? {amount: 0, totalRating: 0, books: []};
          const bookTitle = book.title.replace(/['"]+/g, '');
          itemsMap.set(genre.trim(), {
            amount: oldValue.amount ? oldValue.amount + 1 : 1,
            totalRating: oldValue.totalRating ? (+oldValue.totalRating + +book.myRating) / 2 : +book.myRating,
            books: oldValue.books ? [...oldValue.books, bookTitle] : [bookTitle]
          })
        })
      })


    const genreData = Array.from(itemsMap.entries())
      .filter(entry => entry[1].amount > this.lowerLimit)
      .map(entry => {
        const genre = entry[0];
        const value = entry[1];
        return {
          y: genre + ' (' + value.amount + ')',
          x: value.totalRating,
          count: value.amount,
          books: value.books
        }
      }
    )
    if (this.sortBy === 'myAvgRating') genreData.sort((a: any,b: any) => a.x > b.x ? -1 : 1);
    if (this.sortBy === 'amountOfBooks') genreData.sort((a: any, b: any) => a.count > b.count ? -1 : 1);
    this.barChartData = {
      datasets: [
        {data: genreData as any[], label: 'Genre', borderColor: tailwindColors.primary, backgroundColor: tailwindColors.primary},
    ]}
  }
}
