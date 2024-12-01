import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import {
  AddNewPiDialogComponent,
  AddNewPiDialogData,
  AddNewSprintDialogComponent,
  AddNewSprintDialogData,
  BaseTodoItemsComponent,
  CreateItemDialogComponent,
  CreateItemDialogData,
  TodoItemComponent,
} from '../../components';
import { TodoItem } from '../../interfaces';
import { ApiService } from '../../services';

@Component({
  selector: 'app-todo-items',
  imports: [BaseTodoItemsComponent, DialogModule, MatButtonModule, MatDialogModule, TodoItemComponent],
  templateUrl: './todo-items.component.html',
  styleUrl: './todo-items.component.scss',
})
export class TodoItemsComponent {
  readonly dialog = inject(MatDialog);

  refreshTodoItems: Subject<void> = new Subject<void>();
  pis: string[] = [];
  sprints: number[] = [];

  constructor(private apiService: ApiService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open<CreateItemDialogComponent, CreateItemDialogData, TodoItem>(
      CreateItemDialogComponent,
      {
        width: '500px',
        data: { pis: this.pis, sprints: this.sprints } as CreateItemDialogData,
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
    const dialogRef = this.dialog.open<AddNewPiDialogComponent, AddNewPiDialogData, string>(AddNewPiDialogComponent, {
      width: '500px',
      data: { pis: this.pis } as AddNewPiDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The add new PI dialog was closed', result);
      if (result !== undefined) {
        this.pis = [...this.pis, result];
      } else {
        console.log('No add new PI result');
      }
    });
  }

  openNewSprintDialog(): void {
    const dialogRef = this.dialog.open<AddNewSprintDialogComponent, AddNewSprintDialogData, number>(
      AddNewSprintDialogComponent,
      {
        width: '500px',
        data: { sprints: this.sprints } as AddNewSprintDialogData,
      },
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The add new sprint dialog was closed', result);
      if (result !== undefined) {
        this.sprints = [...this.sprints, result];
      } else {
        console.log('No add new sprint result');
      }
    });
  }

  setPis(pis: string[]): void {
    this.pis = pis;
  }

  setSprints(sprints: number[]): void {
    this.sprints = sprints;
  }
}
