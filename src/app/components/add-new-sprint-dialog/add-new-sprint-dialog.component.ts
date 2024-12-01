import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, Input } from '@angular/core';
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

export interface AddNewSprintDialogData {
  sprints: number[];
}

export function duplicateSprintValidator(sprints: number[]): ValidatorFn {
  return (control: AbstractControl<number>): ValidationErrors | null => {
    const duplicateSprints = sprints.includes(control.value);
    return duplicateSprints ? { duplicateSprint: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-add-new-sprint-dialog',
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
  templateUrl: './add-new-sprint-dialog.component.html',
  styleUrl: './add-new-sprint-dialog.component.scss',
})
export class AddNewSprintDialogComponent {
  @Input() sprints: number[] = [];

  formGroup: FormGroup<{
    formControl: FormControl<number>;
  }>;

  constructor(@Inject(DIALOG_DATA) public data: AddNewSprintDialogData) {
    this.formGroup = new FormGroup({
      formControl: new FormControl<number>(0, {
        nonNullable: true,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        validators: [Validators.required, duplicateSprintValidator(this.data.sprints)],
      }),
    });
  }
}
