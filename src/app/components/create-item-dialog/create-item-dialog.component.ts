import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogData } from '../../interfaces';

@Component({
  selector: 'app-create-item-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-item-dialog.component.html',
  styleUrl: './create-item-dialog.component.scss',
})
export class CreateItemDialogComponent {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
  ) {}
}
