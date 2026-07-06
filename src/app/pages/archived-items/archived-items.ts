import { Component } from '@angular/core';
import { BaseTodoItemsComponent } from '../../components/base-todo-items/base-todo-items';

@Component({
  selector: 'app-archived-items',
  imports: [BaseTodoItemsComponent],
  templateUrl: './archived-items.html',
  styleUrl: './archived-items.scss',
})
export class ArchivedItemsComponent {}
