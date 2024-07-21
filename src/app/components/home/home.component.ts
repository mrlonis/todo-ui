import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TodoItem } from '../../interfaces';
import { ApiService } from '../../services';
import { CreateItemDialogComponent } from '../create-item-dialog/create-item-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CdkAccordionModule, DialogModule, FormsModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  items: TodoItem[] = [];
  expandedIndex = 0;
  animal?: string;
  name?: string;

  constructor(
    private apiService: ApiService,
    public dialog: Dialog,
  ) {}

  ngOnInit() {
    this.apiService.getTodoItems().subscribe((items) => {
      this.items = items;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<TodoItem>(CreateItemDialogComponent, {
      width: '500px',
      data: { title: '' } as TodoItem,
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
      if (result) {
        this.apiService.getTodoItems().subscribe((items) => {
          this.items = items;
        });
      } else {
        console.log('No result');
      }
    });
  }
}
