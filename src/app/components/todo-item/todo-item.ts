import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TodoItem } from '../../interfaces/todo-item';

@Component({
  selector: 'app-todo-item',
  imports: [MatCardModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItemComponent {
  readonly item = input<TodoItem | undefined>();
}
