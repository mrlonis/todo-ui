import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TodoItem } from '../interfaces/todo-item';
import { Api } from './api';

const makeTodoItem = (overrides: Partial<TodoItem> = {}): TodoItem => ({
  id: 1,
  title: 'Test Item',
  prUrls: [],
  urlsUsedForTesting: [],
  completed: false,
  createdOn: '2024-01-01',
  pi: 'PI1',
  sprint: 1,
  type: 'ASSIGNED',
  archived: false,
  ...overrides,
});

describe('Api', () => {
  let service: Api;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:6958/api/todo';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Api);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTodoItems', () => {
    it('should GET /items and return an array of TodoItems', () => {
      const items = [makeTodoItem()];
      let result: TodoItem[] | undefined;

      service.getTodoItems().subscribe((data) => (result = data));

      const req = httpMock.expectOne(`${baseUrl}/items`);
      expect(req.request.method).toBe('GET');
      req.flush(items);

      expect(result).toEqual(items);
    });
  });

  describe('createTodoItem', () => {
    it('should POST /item with the item body and return the created item', () => {
      const item = makeTodoItem();
      let result: TodoItem | undefined;

      service.createTodoItem(item).subscribe((data) => (result = data));

      const req = httpMock.expectOne(`${baseUrl}/item`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(item);
      req.flush(item);

      expect(result).toEqual(item);
    });
  });

  describe('getTodoItemsByPi', () => {
    it('should GET /itemsByPi and return a record keyed by PI', () => {
      const items: Record<string, TodoItem[]> = { PI1: [makeTodoItem()] };
      let result: Record<string, TodoItem[]> | undefined;

      service.getTodoItemsByPi().subscribe((data) => (result = data));

      const req = httpMock.expectOne(`${baseUrl}/itemsByPi`);
      expect(req.request.method).toBe('GET');
      req.flush(items);

      expect(result).toEqual(items);
    });
  });

  describe('getTodoItemsByPiAndBySprint', () => {
    it('should include hideCompleted=true when not archived', () => {
      service.getTodoItemsByPiAndBySprint(true, false).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/itemsByPiAndBySprint?hideCompleted=true`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should include hideCompleted=false when hideCompleted is false and not archived', () => {
      service.getTodoItemsByPiAndBySprint(false, false).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/itemsByPiAndBySprint?hideCompleted=false`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should include archived=true when archived flag is true', () => {
      service.getTodoItemsByPiAndBySprint(true, true).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/itemsByPiAndBySprint?archived=true`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should return a nested record', () => {
      const response: Record<string, Record<string, TodoItem[]>> = {
        PI1: { '1': [makeTodoItem()] },
      };
      let result: Record<string, Record<string, TodoItem[]>> | undefined;

      service.getTodoItemsByPiAndBySprint(false, false).subscribe((data) => (result = data));

      httpMock.expectOne(`${baseUrl}/itemsByPiAndBySprint?hideCompleted=false`).flush(response);

      expect(result).toEqual(response);
    });
  });

  describe('updateTodoItem', () => {
    it('should POST /item with the updated item body', () => {
      const item = makeTodoItem({ title: 'Updated Title' });
      let result: TodoItem | undefined;

      service.updateTodoItem(item).subscribe((data) => (result = data));

      const req = httpMock.expectOne(`${baseUrl}/item`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(item);
      req.flush(item);

      expect(result).toEqual(item);
    });
  });
});
