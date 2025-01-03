import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TodoItem } from '../../interfaces';

@Component({
  selector: 'app-todo-item',
  imports: [MatCardModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input() item?: TodoItem;
}
