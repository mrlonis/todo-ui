import { Routes } from '@angular/router';
import { PageNotFoundComponent, TodoItemsComponent } from './pages';

export const routes: Routes = [
  { path: 'home', component: TodoItemsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
