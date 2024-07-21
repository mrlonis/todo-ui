import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoItem } from '../../interfaces';
import { ApiService } from '../../services';
import { CreateItemDialogComponent } from '../create-item-dialog/create-item-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CdkAccordionModule, FormsModule, DialogModule],
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
    const dialogRef = this.dialog.open<string>(CreateItemDialogComponent, {
      width: '250px',
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}
