import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavSubjectsChartComponent } from './fav-subjects-chart.component';

describe('FavSubjectsChartComponent', () => {
  let component: FavSubjectsChartComponent;
  let fixture: ComponentFixture<FavSubjectsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavSubjectsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavSubjectsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
