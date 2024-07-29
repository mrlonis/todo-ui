import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BaseTodoItemsComponent } from './base-todo-items.component';

describe('BaseTodoItemsComponent', () => {
  let component: BaseTodoItemsComponent;
  let fixture: ComponentFixture<BaseTodoItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseTodoItemsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseTodoItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
