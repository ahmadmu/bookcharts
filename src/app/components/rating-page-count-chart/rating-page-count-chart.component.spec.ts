import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingPageCountChartComponent } from './rating-page-count-chart.component';

describe('RatingPageCountChartComponent', () => {
  let component: RatingPageCountChartComponent;
  let fixture: ComponentFixture<RatingPageCountChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingPageCountChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingPageCountChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
