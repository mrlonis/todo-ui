import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateItemDialog } from '../../components/create-item-dialog/create-item-dialog';
import { TodoItemsPage } from './todo-items';

describe('TodoItemsPage', () => {
  let component: TodoItemsPage;
  let fixture: ComponentFixture<TodoItemsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemsPage, CreateItemDialog],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
