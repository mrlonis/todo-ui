import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseTodoItems } from './base-todo-items';

describe('BaseTodoItems', () => {
  let component: BaseTodoItems;
  let fixture: ComponentFixture<BaseTodoItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseTodoItems],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      animationsEnabled: true,
    }).compileComponents();

    fixture = TestBed.createComponent(BaseTodoItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
