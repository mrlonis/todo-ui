import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { TodoItem } from '../../interfaces';
import { ApiService } from '../../services';
import { AddNewPiDialogComponent, AddNewPiDialogData } from '../add-new-pi-dialog';
import { AddNewSprintDialogComponent, AddNewSprintDialogData } from '../add-new-sprint-dialog';
import { CreateItemDialogComponent, CreateItemDialogData } from '../create-item-dialog/create-item-dialog.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DialogModule, FormsModule, MatButtonModule, MatExpansionModule, MatTableModule, TodoItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  items: TodoItem[] = [];
  expandedIndex = 0;
  animal?: string;
  name?: string;
  pis: string[] = [];
  sprints: number[] = [];

  constructor(
    private apiService: ApiService,
    public dialog: Dialog,
  ) {}

  ngOnInit() {
    this.getTodoItems();
  }

  getTodoItems() {
    this.apiService.getTodoItems().subscribe((items) => {
      this.items = items;

      const piSet = new Set<string>();
      const sprintSet = new Set<number>();

      items.forEach((item) => {
        piSet.add(item.pi);
        sprintSet.add(item.sprint);
      });

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
}
