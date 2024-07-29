import { Routes } from '@angular/router';
import { ArchivedItemsComponent, PageNotFoundComponent, TodoItemsComponent } from './pages';

export const routes: Routes = [
  { path: 'archive', component: ArchivedItemsComponent },
  { path: 'todo', component: TodoItemsComponent },
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
