import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { AddNewSprintDialog, duplicateSprintValidator } from './add-new-sprint-dialog';

describe('duplicateSprintValidator', () => {
  it('should return null when the sprint is not a duplicate', () => {
    const validator = duplicateSprintValidator([1, 2, 3]);
    const control = new FormControl<number>(4, { nonNullable: true });
    expect(validator(control)).toBeNull();
  });

  it('should return a duplicateSprint error when the sprint already exists', () => {
    const validator = duplicateSprintValidator([1, 2, 3]);
    const control = new FormControl<number>(2, { nonNullable: true });
    expect(validator(control)).toEqual({ duplicateSprint: { value: 2 } });
  });

  it('should return null when the sprints list is empty', () => {
    const validator = duplicateSprintValidator([]);
    const control = new FormControl<number>(1, { nonNullable: true });
    expect(validator(control)).toBeNull();
  });
});

describe('AddNewSprintDialog', () => {
  let component: AddNewSprintDialog;
  let fixture: ComponentFixture<AddNewSprintDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewSprintDialog],
      providers: [{ provide: DIALOG_DATA, useValue: { sprints: [1, 2, 3] } }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewSprintDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formControl with value 0', () => {
    expect(component.formGroup.controls.formControl.value).toBe(0);
  });

  it('should be valid for a sprint number not in the existing list', () => {
    component.formGroup.controls.formControl.setValue(4);
    expect(component.formGroup.valid).toBe(true);
  });

  it('should be invalid for a duplicate sprint number', () => {
    component.formGroup.controls.formControl.setValue(2);
    expect(component.formGroup.valid).toBe(false);
    expect(component.formGroup.controls.formControl.errors).toEqual({
      duplicateSprint: { value: 2 },
    });
  });

  it('should inject dialog data', () => {
    expect(component.data.sprints).toEqual([1, 2, 3]);
  });
});
