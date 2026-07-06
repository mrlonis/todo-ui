import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'archive',
    loadComponent: () =>
      import('./pages/archived-items/archived-items').then((m) => m.ArchivedItemsComponent),
  },
  {
    path: 'todo',
    loadComponent: () => import('./pages/todo-items/todo-items').then((m) => m.TodoItemsComponent),
  },
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/page-not-found/page-not-found').then((m) => m.PageNotFoundComponent),
  },
];
