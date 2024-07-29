import { animate, state, style, transition, trigger } from '@angular/animations';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { TodoItem } from '../../interfaces';
import { ApiService } from '../../services';
import { AddNewPiDialogComponent, AddNewPiDialogData } from '../add-new-pi-dialog';
import { AddNewSprintDialogComponent, AddNewSprintDialogData } from '../add-new-sprint-dialog';
import { CreateItemDialogComponent, CreateItemDialogData } from '../create-item-dialog/create-item-dialog.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTableModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatIconModule,
    TodoItemComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './todo-items.component.html',
  styleUrl: './todo-items.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  columnsToDisplay = ['title', 'jiraUrl'];
  columnsToDisplayWithExpand = ['completed', ...this.columnsToDisplay, 'expand'];
  expandedElementId?: number;

  items?: Map<string, Map<number, TodoItem[]>>;
  expandedIndex = 0;
  animal?: string;
  name?: string;
  pis: string[] = [];
  sprints: number[] = [];
  hideCompletedTasks = true;

  constructor(
    private apiService: ApiService,
    public dialog: Dialog,
  ) {}

  ngOnInit() {
    this.getTodoItems();
  }

  getTodoItems() {
    this.apiService.getTodoItemsByPiAndBySprint(this.hideCompletedTasks).subscribe((items) => {
      const piSet = new Set<string>();
      const sprintSet = new Set<number>();
      const newItemsMap = new Map<string, Map<number, TodoItem[]>>();

      for (const pi in items) {
        piSet.add(pi);
        const sprintMap = new Map<number, TodoItem[]>();
        for (const sprint in items[pi]) {
          const sprintIntValue = parseInt(sprint, 10);
          sprintSet.add(sprintIntValue);
          sprintMap.set(sprintIntValue, items[pi][sprint]);
        }
        newItemsMap.set(pi, sprintMap);
      }
      this.items = newItemsMap;

      this.pis = Array.from(piSet);
      this.sprints = Array.from(sprintSet);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<TodoItem>(CreateItemDialogComponent, {
      width: '500px',
      data: { pis: this.pis, sprints: this.sprints } as CreateItemDialogData,
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The Create New TodoItem dialog was closed', result);
      if (result) {
        this.getTodoItems();
      } else {
        console.log('No Create New TodoItem result');
      }
    });
  }

  openNewPiDialog(): void {
    const dialogRef = this.dialog.open<string>(AddNewPiDialogComponent, {
      width: '500px',
      data: { pis: this.pis } as AddNewPiDialogData,
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The add new PI dialog was closed', result);
      if (result !== undefined) {
        this.pis = [...this.pis, result];
      } else {
        console.log('No add new PI result');
      }
    });
  }

  openNewSprintDialog(): void {
    const dialogRef = this.dialog.open<number>(AddNewSprintDialogComponent, {
      width: '500px',
      data: { sprints: this.sprints } as AddNewSprintDialogData,
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The add new sprint dialog was closed', result);
      if (result !== undefined) {
        this.sprints = [...this.sprints, result];
      } else {
        console.log('No add new sprint result');
      }
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
}
