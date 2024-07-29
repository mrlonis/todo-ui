import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedItemsComponent } from './archived-items.component';

describe('ArchivedItemsComponent', () => {
  let component: ArchivedItemsComponent;
  let fixture: ComponentFixture<ArchivedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
