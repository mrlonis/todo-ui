import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddNewSprintDialogComponent } from './add-new-sprint-dialog.component';

describe('AddNewSprintDialogComponent', () => {
  let component: AddNewSprintDialogComponent;
  let fixture: ComponentFixture<AddNewSprintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewSprintDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: [0] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewSprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
