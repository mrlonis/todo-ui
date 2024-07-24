import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPiDialogComponent } from './add-new-pi-dialog.component';

describe('AddNewPiDialogComponent', () => {
  let component: AddNewPiDialogComponent;
  let fixture: ComponentFixture<AddNewPiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPiDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewPiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
