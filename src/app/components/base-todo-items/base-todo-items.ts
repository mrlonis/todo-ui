import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { TodoItem } from '../../interfaces/todo-item';
import { Api } from '../../services/api';
import { MetadataApi } from '../../services/metadata-api';
import { TodoItemComponent } from '../todo-item/todo-item';

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
  templateUrl: './base-todo-items.html',
  styleUrl: './base-todo-items.scss',
})
export class BaseTodoItems implements OnInit {
  private readonly apiService = inject(Api);
  private readonly metadataApiService = inject(MetadataApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly title = input<string>('');
  readonly archive = input<boolean>(false);
  readonly refreshTodoItems = input<Observable<void> | undefined>();
  readonly pis = output<string[]>();
  readonly sprints = output<number[]>();

  readonly columnsToDisplay = ['title', 'jiraUrl'];
  readonly columnsToDisplayWithExpand = computed(() => {
    const cols = ['completed', ...this.columnsToDisplay, 'expand'];
    return this.archive() ? cols : [...cols, 'archive'];
  });

  readonly items = signal<Map<string, Map<number, TodoItem[]>> | undefined>(undefined);
  readonly expandedElementId = signal<number | undefined>(undefined);
  readonly hideCompletedTasks = signal(true);

  ngOnInit() {
    this.getTodoItems();
    const refreshTodoItemsObservable = this.refreshTodoItems();
    if (refreshTodoItemsObservable !== undefined) {
      refreshTodoItemsObservable
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.getTodoItems());
    }

    this.metadataApiService.getAllPis().subscribe((pis) => this.pis.emit(pis));
    this.metadataApiService.getAllSprints().subscribe((sprints) => this.sprints.emit(sprints));
  }

  getTodoItems() {
    this.apiService
      .getTodoItemsByPiAndBySprint(this.hideCompletedTasks(), this.archive())
      .subscribe((response) => {
        const newItemsMap = new Map<string, Map<number, TodoItem[]>>();

        for (const pi in response) {
          const sprintMap = new Map<number, TodoItem[]>();
          for (const sprint in response[pi]) {
            const sprintIntValue = parseInt(sprint, 10);
            sprintMap.set(sprintIntValue, response[pi][sprint]);
          }
          newItemsMap.set(pi, sprintMap);
        }
        this.items.set(newItemsMap);
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

    // Check if event target id contains completed-checkbox; if so, ignore (but still stop propagation if desired)
    if ((event.target as HTMLElement).id.includes('completed-checkbox')) {
      console.log('Ignoring row expansion event because it was triggered by the checkbox');
      if (stopPropagation) {
        console.log('Stopping propagation');
        event.stopPropagation();
      }
      return;
    }

    console.log('Expanding element', element);
    this.expandedElementId.set(this.expandedElementId() === element.id ? undefined : element.id);
    console.log('Expanded element', this.expandedElementId());
    if (stopPropagation) {
      console.log('Stopping propagation');
      event.stopPropagation();
    }
  }

  handleHideTasks(event: MatSlideToggleChange) {
    console.log('Hide completed tasks', event);
    this.hideCompletedTasks.set(event.checked);
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
    return element.completed && this.archive();
  }
}
