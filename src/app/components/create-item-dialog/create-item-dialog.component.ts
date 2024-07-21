import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TodoItem } from '../../interfaces';

export interface PrUrlFormGroupArray {
  name: string;
  control: FormControl<string | null>;
}

export interface TestingUrlFormGroupArray {
  name: string;
  control: FormControl<string | null>;
}

@Component({
  selector: 'app-create-item-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-item-dialog.component.html',
  styleUrl: './create-item-dialog.component.scss',
})
export class CreateItemDialogComponent {
  prUrlsFormGroup = new FormGroup<Record<string, FormControl<string | null>>>({});
  prUrlsFormGroupAsArray: PrUrlFormGroupArray[] = [];
  urlsUsedForTestingFormGroup = new FormGroup<Record<string, FormControl<string | null>>>({});
  urlsUsedForTestingFormGroupAsArray: TestingUrlFormGroupArray[] = [];
  createItemDialogForm = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    titleFormControl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    jiraUrlFormControl: new FormControl<string | null>(null),
    prUrls: this.prUrlsFormGroup,
    cloudForgeConsoleUrl: new FormControl<string | null>(null),
    releaseRequestUrl: new FormControl<string | null>(null),
    urlsUsedForTesting: this.urlsUsedForTestingFormGroup,
    completed: new FormControl<boolean>(false, { nonNullable: true }),
    oneNoteUrl: new FormControl<string | null>(null),
  });

  constructor(
    public dialogRef: DialogRef<TodoItem>,
    @Inject(DIALOG_DATA) public data: TodoItem,
  ) {}

  getTodoItem(): TodoItem {
    this.data.title = this.createItemDialogForm.controls.titleFormControl.value;
    this.data.jiraUrl = this.createItemDialogForm.controls.jiraUrlFormControl.value ?? undefined;
    this.data.prUrls = this.getPrUrlFormControlsAsArray()
      .filter((prUrl) => prUrl.control.value !== null)
      .map((prUrl) => prUrl.control.value) as string[];
    this.data.cloudForgeConsoleUrl = this.createItemDialogForm.controls.cloudForgeConsoleUrl.value ?? undefined;
    this.data.releaseRequestUrl = this.createItemDialogForm.controls.releaseRequestUrl.value ?? undefined;
    this.data.urlsUsedForTesting = this.getUrlsUsedForTestingFormControlsAsArray()
      .filter((testingUrl) => testingUrl.control.value !== null)
      .map((testingUrl) => testingUrl.control.value) as string[];
    this.data.completed = this.createItemDialogForm.controls.completed.value ?? false;
    this.data.oneNoteUrl = this.createItemDialogForm.controls.oneNoteUrl.value ?? undefined;
    return this.data;
  }

  onSubmit() {
    console.log('onSubmit');
    const todoItem = this.getTodoItem();
    console.log('todoItem', todoItem);
    this.dialogRef.close(todoItem);
  }

  getPrUrlFormControlsAsArray(): PrUrlFormGroupArray[] {
    const keys = Object.keys(this.prUrlsFormGroup.controls);
    const returnValue = [];
    for (const key of keys) {
      returnValue.push({ name: key, control: this.prUrlsFormGroup.controls[key] } as PrUrlFormGroupArray);
    }
    this.prUrlsFormGroupAsArray = returnValue;
    return returnValue;
  }

  addNewPrUrl() {
    setTimeout(() => {
      const newFormControlName = 'jiraUrlFormControl' + (this.prUrlsFormGroupAsArray.length + 1);
      const newFormControl = new FormControl<string | null>(null);
      this.prUrlsFormGroup.addControl(newFormControlName, newFormControl);
      this.prUrlsFormGroupAsArray.push({
        name: newFormControlName,
        control: newFormControl,
      });
    }, 0);
  }

  getUrlsUsedForTestingFormControlsAsArray(): TestingUrlFormGroupArray[] {
    const keys = Object.keys(this.urlsUsedForTestingFormGroup.controls);
    const returnValue = [];
    for (const key of keys) {
      returnValue.push({
        name: key,
        control: this.urlsUsedForTestingFormGroup.controls[key],
      } as TestingUrlFormGroupArray);
    }
    this.urlsUsedForTestingFormGroupAsArray = returnValue;
    return returnValue;
  }

  addNewTestingUrl() {
    setTimeout(() => {
      const newFormControlName = 'testingUrlFormControl' + (this.urlsUsedForTestingFormGroupAsArray.length + 1);
      const newFormControl = new FormControl<string | null>(null);
      this.urlsUsedForTestingFormGroup.addControl(newFormControlName, newFormControl);
      this.urlsUsedForTestingFormGroupAsArray.push({
        name: newFormControlName,
        control: newFormControl,
      });
    }, 0);
  }
}
