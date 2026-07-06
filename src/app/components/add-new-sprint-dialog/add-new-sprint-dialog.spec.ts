import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewSprintDialog } from './add-new-sprint-dialog';

describe('AddNewSprintDialog', () => {
  let component: AddNewSprintDialog;
  let fixture: ComponentFixture<AddNewSprintDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewSprintDialog],
      providers: [{ provide: DIALOG_DATA, useValue: { sprints: [0] } }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewSprintDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
