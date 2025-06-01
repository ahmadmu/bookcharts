import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericRatingBarChart } from './generic-rating-bar-chart.component';

describe('GenericRatingBarChart', () => {
  let component: GenericRatingBarChart;
  let fixture: ComponentFixture<GenericRatingBarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericRatingBarChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericRatingBarChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
