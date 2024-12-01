import { Component } from '@angular/core';
import { BaseTodoItemsComponent } from '../../components';

@Component({
  selector: 'app-archived-items',
  imports: [BaseTodoItemsComponent],
  templateUrl: './archived-items.component.html',
  styleUrl: './archived-items.component.scss',
})
export class ArchivedItemsComponent {}
