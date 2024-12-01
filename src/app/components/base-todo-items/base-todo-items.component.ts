import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { TodoItem } from '../../interfaces';
import { ApiService, MetadataApiService } from '../../services';
import { TodoItemComponent } from '../todo-item';

@Component({
  selector: 'app-base-todo-items',
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatTableModule,
    ReactiveFormsModule,
    TodoItemComponent,
  ],
  templateUrl: './base-todo-items.component.html',
  styleUrl: './base-todo-items.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BaseTodoItemsComponent implements OnInit, OnDestroy {
  private eventsSubscription?: Subscription;
  @Input() title = '';
  @Input() archive = false;
  @Input() refreshTodoItems?: Observable<void>;
  @Output() pis = new EventEmitter<string[]>();
  @Output() sprints = new EventEmitter<number[]>();

  columnsToDisplay = ['title', 'jiraUrl'];
  columnsToDisplayWithExpand = ['completed', ...this.columnsToDisplay, 'expand'];
  expandedElementId?: number;

  items?: Map<string, Map<number, TodoItem[]>>;
  expandedIndex = 0;
  hideCompletedTasks = true;

  constructor(
    private apiService: ApiService,
    private metadataApiService: MetadataApiService,
  ) {}

  ngOnInit() {
    this.getTodoItems();
    if (this.refreshTodoItems !== undefined) {
      this.eventsSubscription = this.refreshTodoItems.subscribe(() => this.getTodoItems());
    }

    if (!this.archive) {
      this.columnsToDisplayWithExpand = [...this.columnsToDisplayWithExpand, 'archive'];
    }

    this.metadataApiService.getAllPis().subscribe((pis) => this.pis.emit(pis));
    this.metadataApiService.getAllSprints().subscribe((sprints) => this.sprints.emit(sprints));
  }

  ngOnDestroy() {
    if (this.eventsSubscription !== undefined) {
      this.eventsSubscription.unsubscribe();
    }
  }

  getTodoItems() {
    this.apiService.getTodoItemsByPiAndBySprint(this.hideCompletedTasks, this.archive).subscribe((response) => {
      const newItemsMap = new Map<string, Map<number, TodoItem[]>>();

      for (const pi in response) {
        const sprintMap = new Map<number, TodoItem[]>();
        for (const sprint in response[pi]) {
          const sprintIntValue = parseInt(sprint, 10);
          sprintMap.set(sprintIntValue, response[pi][sprint]);
        }
        newItemsMap.set(pi, sprintMap);
      }
      this.items = newItemsMap;
    });
  }

  onCheckboxChange(event: MatCheckboxChange, item: TodoItem) {
    console.log('Checkbox changed', event, item);
    item.completed = !item.completed;
    this.apiService.updateTodoItem(item).subscribe((updatedItem) => {
      console.log('Updated item', updatedItem);
      this.getTodoItems();
    });
  }

  handleRowExpansion(event: Event, element: TodoItem, stopPropagation = false) {
    console.log('Row expansion', event, element, stopPropagation);

    // Check if event target id contains completed-checkbox, If it does, ignore the event (but still stop propagation if desired)
    if ((event.target as HTMLElement).id.includes('completed-checkbox')) {
      console.log('Ignoring row expansion event because it was triggered by the checkbox');
      if (stopPropagation) {
        console.log('Stopping propagation');
        event.stopPropagation();
      }
      return;
    }

    console.log('Expanding element', element);
    this.expandedElementId = this.expandedElementId === element.id ? undefined : element.id;
    console.log('Expanded element', this.expandedElementId);
    if (stopPropagation) {
      console.log('Stopping propagation');
      event.stopPropagation();
    }
  }

  handleHideTasks(event: MatSlideToggleChange) {
    console.log('Hide completed tasks', event);
    this.hideCompletedTasks = event.checked;
    this.getTodoItems();
  }

  handleArchive(event: MouseEvent, element: TodoItem) {
    console.log('Archiving Element: ', event, element);
    element.archived = true;
    this.apiService.updateTodoItem(element).subscribe((updatedItem) => {
      console.log('Updated item', updatedItem);
      this.getTodoItems();
    });
  }

  completedCheckboxDisabled(element: TodoItem): boolean {
    return element.completed && this.archive;
  }
}
