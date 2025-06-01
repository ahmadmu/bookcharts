import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavGenresChartComponent } from './fav-genres-chart.component';

describe('FavGenresChartComponent', () => {
  let component: FavGenresChartComponent;
  let fixture: ComponentFixture<FavGenresChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavGenresChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavGenresChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
