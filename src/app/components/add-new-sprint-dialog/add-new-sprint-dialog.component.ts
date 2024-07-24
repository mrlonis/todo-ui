import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AddNewSprintDialogData {
  sprints: number[];
}

@Component({
  selector: 'app-add-new-sprint-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-new-sprint-dialog.component.html',
  styleUrl: './add-new-sprint-dialog.component.scss',
})
export class AddNewSprintDialogComponent {
  @Input() sprints: number[] = [];

  formGroup = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    formControl: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    public dialogRef: DialogRef<number>,
    @Inject(DIALOG_DATA) public data: number,
  ) {}

  onSubmit() {
    this.dialogRef.close(this.formGroup.controls.formControl.value);
  }
}
