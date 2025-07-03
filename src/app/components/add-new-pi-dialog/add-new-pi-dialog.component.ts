import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Input, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AddNewPiDialogData {
  pis: string[];
}

export function duplicatePiValidator(pis: string[]): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const duplicatePi = pis.includes(control.value);
    return duplicatePi ? { duplicatePi: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-add-new-pi-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-new-pi-dialog.component.html',
  styleUrl: './add-new-pi-dialog.component.scss',
})
export class AddNewPiDialogComponent {
  data = inject<AddNewPiDialogData>(DIALOG_DATA);

  @Input() pis: string[] = [];

  formGroup: FormGroup<{
    formControl: FormControl<string>;
  }>;

  constructor() {
    this.formGroup = new FormGroup({
      formControl: new FormControl<string>('', {
        nonNullable: true,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        validators: [Validators.required, duplicatePiValidator(this.data.pis)],
      }),
    });
  }
}
