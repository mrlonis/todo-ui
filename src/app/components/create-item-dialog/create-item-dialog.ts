import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { TODO_ITEM_TYPES, TodoItem, TodoItemType } from '../../interfaces/todo-item';
import { Api } from '../../services/api';

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
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-item-dialog.html',
  styleUrl: './create-item-dialog.scss',
})
export class CreateItemDialog {
  dialogRef = inject<DialogRef<TodoItem>>(DialogRef);
  data = inject<CreateItemDialogData>(DIALOG_DATA);
  private apiService = inject(Api);

  pis: string[];
  sprints: number[];

  nextPrUrlIdNum = 1;
  nextTestingUrlIdNum = 1;
  todoItemTypes = TODO_ITEM_TYPES;

  prUrlsFormGroup = new FormGroup<Record<string, AbstractControl<string | null>>>({});
  readonly prUrlsFormGroupAsArray = signal<PrUrlFormGroupArray[]>([]);
  urlsUsedForTestingFormGroup = new FormGroup<Record<string, AbstractControl<string | null>>>({});
  readonly urlsUsedForTestingFormGroupAsArray = signal<TestingUrlFormGroupArray[]>([]);
  createItemDialogForm = new FormGroup({
    titleFormControl: new FormControl<string>('', {
      nonNullable: true,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      validators: [Validators.required],
    }),
    jiraUrlFormControl: new FormControl<string | null>(null),

    piFormControl: new FormControl<string>('', {
      nonNullable: true,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      validators: [Validators.required],
    }),

    sprintFormControl: new FormControl<number>(0, {
      nonNullable: true,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      validators: [Validators.required],
    }),
    typeFormControl: new FormControl<TodoItemType>('ASSIGNED', { nonNullable: true }),
    prUrls: this.prUrlsFormGroup,
    cloudForgeConsoleUrl: new FormControl<string | null>(null),
    releaseRequestUrl: new FormControl<string | null>(null),
    urlsUsedForTesting: this.urlsUsedForTestingFormGroup,
    oneNoteUrl: new FormControl<string | null>(null),
  });

  constructor() {
    const data = this.data;

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
      cloudForgeConsoleUrl:
        this.createItemDialogForm.controls.cloudForgeConsoleUrl.value ?? undefined,
      releaseRequestUrl: this.createItemDialogForm.controls.releaseRequestUrl.value ?? undefined,
      urlsUsedForTesting: this.getUrlsUsedForTestingFormControlsAsArray()
        .filter((testingUrl) => testingUrl.control.value !== null)
        .map((testingUrl) => testingUrl.control.value) as string[],
      completed: false,
      oneNoteUrl: this.createItemDialogForm.controls.oneNoteUrl.value ?? undefined,
      pi: this.createItemDialogForm.controls.piFormControl.value,
      sprint: this.createItemDialogForm.controls.sprintFormControl.value,
      type: this.createItemDialogForm.controls.typeFormControl.value,
    } as TodoItem;
  }

  getPrUrlFormControlsAsArray(): PrUrlFormGroupArray[] {
    return this.prUrlsFormGroupAsArray();
  }

  addNewPrUrl() {
    setTimeout(() => {
      const newFormControlName = 'prUrlFormControl' + this.nextPrUrlIdNum++;
      const newFormControl = new FormControl<string | null>(null);
      this.prUrlsFormGroup.addControl(newFormControlName, newFormControl);
      this.prUrlsFormGroupAsArray.update((arr) => [
        ...arr,
        { name: newFormControlName, control: newFormControl },
      ]);
    }, 0);
  }

  removePrUrl(formControlName: string) {
    this.prUrlsFormGroup.removeControl(formControlName);
    this.prUrlsFormGroupAsArray.update((arr) =>
      arr.filter((item) => item.name !== formControlName),
    );
  }

  getUrlsUsedForTestingFormControlsAsArray(): TestingUrlFormGroupArray[] {
    return this.urlsUsedForTestingFormGroupAsArray();
  }

  addNewTestingUrl() {
    setTimeout(() => {
      const newFormControlName = 'testingUrlFormControl' + this.nextTestingUrlIdNum++;
      const newFormControl = new FormControl<string | null>(null);
      this.urlsUsedForTestingFormGroup.addControl(newFormControlName, newFormControl);
      this.urlsUsedForTestingFormGroupAsArray.update((arr) => [
        ...arr,
        { name: newFormControlName, control: newFormControl },
      ]);
    }, 0);
  }

  removeTestingUrl(formControlName: string) {
    this.urlsUsedForTestingFormGroup.removeControl(formControlName);
    this.urlsUsedForTestingFormGroupAsArray.update((arr) =>
      arr.filter((item) => item.name !== formControlName),
    );
  }
}
