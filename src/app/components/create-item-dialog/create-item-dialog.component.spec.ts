import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemDialogComponent } from './create-item-dialog.component';

describe('CreateItemDialogComponent', () => {
  let component: CreateItemDialogComponent;
  let fixture: ComponentFixture<CreateItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateItemDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
