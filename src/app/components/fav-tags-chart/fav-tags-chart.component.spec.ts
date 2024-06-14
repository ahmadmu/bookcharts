import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavTagsChartComponent } from './fav-tags-chart.component';

describe('FavTagsChartComponent', () => {
  let component: FavTagsChartComponent;
  let fixture: ComponentFixture<FavTagsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavTagsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavTagsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
