import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingYearPublishedChartComponent } from './rating-year-published-chart.component';

describe('RatingYearPublishedChartComponent', () => {
  let component: RatingYearPublishedChartComponent;
  let fixture: ComponentFixture<RatingYearPublishedChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingYearPublishedChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingYearPublishedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
