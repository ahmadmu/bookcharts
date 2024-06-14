import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavAuthorChartComponent } from './fav-author-chart.component';

describe('FavAuthorChartComponent', () => {
  let component: FavAuthorChartComponent;
  let fixture: ComponentFixture<FavAuthorChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavAuthorChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavAuthorChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
