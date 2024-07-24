import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AddNewPiDialogData {
  pis: string[];
}

@Component({
  selector: 'app-add-new-pi-dialog',
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
  templateUrl: './add-new-pi-dialog.component.html',
  styleUrl: './add-new-pi-dialog.component.scss',
})
export class AddNewPiDialogComponent {
  @Input() pis: string[] = [];

  formGroup = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    formControl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: string,
  ) {}

  onSubmit() {
    this.dialogRef.close(this.formGroup.controls.formControl.value);
  }
}
