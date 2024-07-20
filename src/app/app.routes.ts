import { Routes } from '@angular/router';
import { HomeComponent, PageNotFoundComponent } from './components';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
