import { Routes } from '@angular/router';
import { ChartsComponent } from './components/charts/charts.component';
import { RandomizerComponent } from './components/randomizer/randomizer.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'charts'},
  { path: 'charts', component: ChartsComponent},
  { path: 'randomizer', component: RandomizerComponent }
];
