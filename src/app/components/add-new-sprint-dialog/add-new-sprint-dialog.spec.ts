import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewSprintDialogComponent } from './add-new-sprint-dialog';

describe('AddNewSprintDialogComponent', () => {
  let component: AddNewSprintDialogComponent;
  let fixture: ComponentFixture<AddNewSprintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewSprintDialogComponent],
      providers: [{ provide: DIALOG_DATA, useValue: { sprints: [0] } }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewSprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
