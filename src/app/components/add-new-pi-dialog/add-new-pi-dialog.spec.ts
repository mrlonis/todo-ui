import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewPiDialog } from './add-new-pi-dialog';

describe('AddNewPiDialog', () => {
  let component: AddNewPiDialog;
  let fixture: ComponentFixture<AddNewPiDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPiDialog],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: { pis: ['1'] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewPiDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
