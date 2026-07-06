import { Routes } from '@angular/router';
import { ArchivedItemsComponent } from './pages/archived-items/archived-items';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found';
import { TodoItemsComponent } from './pages/todo-items/todo-items';

export const routes: Routes = [
  { path: 'archive', component: ArchivedItemsComponent },
  { path: 'todo', component: TodoItemsComponent },
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
