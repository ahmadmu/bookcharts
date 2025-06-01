import { Routes } from '@angular/router';
import { ChartsComponent } from './pages/charts/charts.component';
import { RandomizerComponent } from './pages/randomizer/randomizer.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'charts'},
  { path: 'charts', component: ChartsComponent},
  { path: 'randomizer', component: RandomizerComponent }
];
