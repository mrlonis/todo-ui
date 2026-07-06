import { Component } from '@angular/core';
import { BaseTodoItems } from '../../components/base-todo-items/base-todo-items';

@Component({
  selector: 'app-archived-items',
  imports: [BaseTodoItems],
  templateUrl: './archived-items.html',
  styleUrl: './archived-items.scss',
})
export class ArchivedItemsPage {}
