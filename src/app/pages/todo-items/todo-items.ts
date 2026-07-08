import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {
  AddNewPiDialog,
  AddNewPiDialogData,
} from '../../components/add-new-pi-dialog/add-new-pi-dialog';
import {
  AddNewSprintDialog,
  AddNewSprintDialogData,
} from '../../components/add-new-sprint-dialog/add-new-sprint-dialog';
import { BaseTodoItems } from '../../components/base-todo-items/base-todo-items';
import {
  CreateItemDialog,
  CreateItemDialogData,
} from '../../components/create-item-dialog/create-item-dialog';
import { TodoItem } from '../../interfaces/todo-item';
import { Api } from '../../services/api';

@Component({
  selector: 'app-todo-items',
  imports: [BaseTodoItems, DialogModule, MatButtonModule, MatDialogModule],
  templateUrl: './todo-items.html',
  styleUrl: './todo-items.scss',
})
export class TodoItemsPage {
  private readonly apiService = inject(Api);

  readonly dialog = inject(MatDialog);

  readonly refreshTodoItems: Subject<void> = new Subject<void>();
  readonly pis = signal<string[]>([]);
  readonly sprints = signal<number[]>([]);

  openDialog(): void {
    const dialogRef = this.dialog.open<CreateItemDialog, CreateItemDialogData, TodoItem>(
      CreateItemDialog,
      {
        width: '500px',
        data: { pis: this.pis(), sprints: this.sprints() },
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The Create New TodoItem dialog was closed', result);
      if (result) {
        this.apiService.createTodoItem(result).subscribe((result) => {
          console.log('result', result);
          this.refreshTodoItems.next();
        });
      } else {
        console.log('No Create New TodoItem result');
      }
    });
  }

  openNewPiDialog(): void {
    const dialogRef = this.dialog.open<AddNewPiDialog, AddNewPiDialogData, string>(AddNewPiDialog, {
      width: '500px',
      data: { pis: this.pis() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The add new PI dialog was closed', result);
      if (result) {
        this.pis.update((pis) => [...pis, result]);
      } else {
        console.log('No add new PI result');
      }
    });
  }

  openNewSprintDialog(): void {
    const dialogRef = this.dialog.open<AddNewSprintDialog, AddNewSprintDialogData, number | string>(
      AddNewSprintDialog,
      {
        width: '500px',
        data: { sprints: this.sprints() },
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The add new sprint dialog was closed', result);
      if (typeof result === 'string') {
        result = parseInt(result, 10);
      }
      if (result !== undefined && !isNaN(result)) {
        this.sprints.update((sprints) => [...sprints, result]);
      } else {
        console.log('No add new sprint result');
      }
    });
  }

  setPis(pis: string[]): void {
    this.pis.set(pis);
  }

  setSprints(sprints: number[]): void {
    this.sprints.set(sprints);
  }
}
