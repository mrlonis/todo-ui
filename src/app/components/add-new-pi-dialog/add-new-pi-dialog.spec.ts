import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { AddNewPiDialog, duplicatePiValidator } from './add-new-pi-dialog';

describe('duplicatePiValidator', () => {
  it('should return null when value is not a duplicate', () => {
    const validator = duplicatePiValidator(['PI1', 'PI2']);
    const control = new FormControl<string>('PI3', { nonNullable: true });
    expect(validator(control)).toBeNull();
  });

  it('should return a duplicatePi error when value matches an existing PI', () => {
    const validator = duplicatePiValidator(['PI1', 'PI2']);
    const control = new FormControl<string>('PI1', { nonNullable: true });
    expect(validator(control)).toEqual({ duplicatePi: { value: 'PI1' } });
  });

  it('should return null when the pis list is empty', () => {
    const validator = duplicatePiValidator([]);
    const control = new FormControl<string>('PI1', { nonNullable: true });
    expect(validator(control)).toBeNull();
  });
});

describe('AddNewPiDialog', () => {
  let component: AddNewPiDialog;
  let fixture: ComponentFixture<AddNewPiDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPiDialog],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: { pis: ['PI1', 'PI2'] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewPiDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formControl with an empty string', () => {
    expect(component.formGroup.controls.formControl.value).toBe('');
  });

  it('should be invalid initially because the field is required', () => {
    expect(component.formGroup.valid).toBe(false);
  });

  it('should be valid for a new PI value not in the existing list', () => {
    component.formGroup.controls.formControl.setValue('PI3');
    expect(component.formGroup.valid).toBe(true);
  });

  it('should be invalid for a duplicate PI value', () => {
    component.formGroup.controls.formControl.setValue('PI1');
    expect(component.formGroup.valid).toBe(false);
    expect(component.formGroup.controls.formControl.errors).toEqual({
      duplicatePi: { value: 'PI1' },
    });
  });

  it('should inject dialog data', () => {
    expect(component.data.pis).toEqual(['PI1', 'PI2']);
  });
});
