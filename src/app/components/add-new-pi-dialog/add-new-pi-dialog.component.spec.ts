import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewPiDialogComponent, AddNewPiDialogData } from './add-new-pi-dialog.component';

describe('AddNewPiDialogComponent', () => {
  let component: AddNewPiDialogComponent;
  let fixture: ComponentFixture<AddNewPiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPiDialogComponent],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: { pis: ['1'] } as AddNewPiDialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewPiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
