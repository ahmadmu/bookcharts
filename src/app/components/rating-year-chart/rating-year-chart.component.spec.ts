import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingYearChartComponent } from './rating-year-chart.component';

describe('RatingYearChartComponent', () => {
  let component: RatingYearChartComponent;
  let fixture: ComponentFixture<RatingYearChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingYearChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingYearChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
