import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavGenresPerYearComponent } from './fav-genres-per-year.component';

describe('FavGenresPerYearComponent', () => {
  let component: FavGenresPerYearComponent;
  let fixture: ComponentFixture<FavGenresPerYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavGenresPerYearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavGenresPerYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
