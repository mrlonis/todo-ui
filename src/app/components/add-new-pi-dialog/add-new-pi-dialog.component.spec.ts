import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AddNewPiDialogComponent } from './add-new-pi-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AddNewPiDialogComponent', () => {
  let component: AddNewPiDialogComponent;
  let fixture: ComponentFixture<AddNewPiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPiDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: ['1'] },
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
