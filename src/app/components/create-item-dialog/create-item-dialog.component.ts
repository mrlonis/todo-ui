import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { TODO_ITEM_TYPES, TodoItem, TodoItemType } from '../../interfaces';
import { ApiService } from '../../services';

export interface CreateItemDialogData {
  pis: string[];
  sprints: number[];
}

export interface PrUrlFormGroupArray {
  name: string;
  control: AbstractControl<string | null>;
}

export interface TestingUrlFormGroupArray {
  name: string;
  control: AbstractControl<string | null>;
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
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-item-dialog.component.html',
  styleUrl: './create-item-dialog.component.scss',
})
export class CreateItemDialogComponent {
  pis: string[];
  sprints: number[];

  nextPrUrlIdNum = 1;
  nextTestingUrlIdNum = 1;
  todoItemTypes = TODO_ITEM_TYPES;

  prUrlsFormGroup = new FormGroup<Record<string, AbstractControl<string | null>>>({});
  prUrlsFormGroupAsArray: PrUrlFormGroupArray[] = [];
  urlsUsedForTestingFormGroup = new FormGroup<Record<string, AbstractControl<string | null>>>({});
  urlsUsedForTestingFormGroupAsArray: TestingUrlFormGroupArray[] = [];
  createItemDialogForm = new FormGroup({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    titleFormControl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    jiraUrlFormControl: new FormControl<string | null>(null),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    piFormControl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    sprintFormControl: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    typeFormControl: new FormControl<TodoItemType>('ASSIGNED', { nonNullable: true }),
    prUrls: this.prUrlsFormGroup,
    cloudForgeConsoleUrl: new FormControl<string | null>(null),
    releaseRequestUrl: new FormControl<string | null>(null),
    urlsUsedForTesting: this.urlsUsedForTestingFormGroup,
    completed: new FormControl<boolean>(false, { nonNullable: true }),
    oneNoteUrl: new FormControl<string | null>(null),
  });

  constructor(
    public dialogRef: DialogRef<TodoItem>,
    @Inject(DIALOG_DATA) public data: CreateItemDialogData,
    private apiService: ApiService,
  ) {
    console.log('data', data);
    this.pis = data.pis;
    this.sprints = data.sprints;
  }

  getTodoItem(): TodoItem {
    return {
      title: this.createItemDialogForm.controls.titleFormControl.value,
      jiraUrl: this.createItemDialogForm.controls.jiraUrlFormControl.value ?? undefined,
      prUrls: this.getPrUrlFormControlsAsArray()
        .filter((prUrl) => prUrl.control.value !== null)
        .map((prUrl) => prUrl.control.value) as string[],
      cloudForgeConsoleUrl: this.createItemDialogForm.controls.cloudForgeConsoleUrl.value ?? undefined,
      releaseRequestUrl: this.createItemDialogForm.controls.releaseRequestUrl.value ?? undefined,
      urlsUsedForTesting: this.getUrlsUsedForTestingFormControlsAsArray()
        .filter((testingUrl) => testingUrl.control.value !== null)
        .map((testingUrl) => testingUrl.control.value) as string[],
      completed: this.createItemDialogForm.controls.completed.value ?? false,
      oneNoteUrl: this.createItemDialogForm.controls.oneNoteUrl.value ?? undefined,
      pi: this.createItemDialogForm.controls.piFormControl.value,
      sprint: this.createItemDialogForm.controls.sprintFormControl.value,
      type: this.createItemDialogForm.controls.typeFormControl.value,
    } as TodoItem;
  }

  onSubmit() {
    console.log('onSubmit');
    const todoItem = this.getTodoItem();
    console.log('todoItem', todoItem);
    this.apiService.createTodoItem(todoItem).subscribe((result) => {
      console.log('result', result);
      this.dialogRef.close(result);
    });
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
      const newFormControlName = 'prUrlFormControl' + this.nextPrUrlIdNum++;
      const newFormControl = new FormControl<string | null>(null);
      this.prUrlsFormGroup.addControl(newFormControlName, newFormControl);
      this.prUrlsFormGroupAsArray.push({
        name: newFormControlName,
        control: newFormControl,
      });
    }, 0);
  }

  removePrUrl(formControlName: string) {
    this.prUrlsFormGroup.removeControl(formControlName);
    const index = this.prUrlsFormGroupAsArray.findIndex((prUrl) => prUrl.name === formControlName);
    if (index !== -1) {
      this.prUrlsFormGroupAsArray.splice(index, 1);
    }
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
      const newFormControlName = 'testingUrlFormControl' + this.nextTestingUrlIdNum++;
      const newFormControl = new FormControl<string | null>(null);
      this.urlsUsedForTestingFormGroup.addControl(newFormControlName, newFormControl);
      this.urlsUsedForTestingFormGroupAsArray.push({
        name: newFormControlName,
        control: newFormControl,
      });
    }, 0);
  }

  removeTestingUrl(formControlName: string) {
    this.urlsUsedForTestingFormGroup.removeControl(formControlName);
    const index = this.urlsUsedForTestingFormGroupAsArray.findIndex(
      (testingUrl) => testingUrl.name === formControlName,
    );
    if (index !== -1) {
      this.urlsUsedForTestingFormGroupAsArray.splice(index, 1);
    }
  }
}
