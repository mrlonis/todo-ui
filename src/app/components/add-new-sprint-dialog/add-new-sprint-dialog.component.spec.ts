import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSprintDialogComponent } from './add-new-sprint-dialog.component';

describe('AddNewSprintDialogComponent', () => {
  let component: AddNewSprintDialogComponent;
  let fixture: ComponentFixture<AddNewSprintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewSprintDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewSprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
