import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subject } from 'rxjs';
import { TodoItem } from '../../interfaces/todo-item';
import { BaseTodoItems } from './base-todo-items';

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

describe('BaseTodoItems', () => {
  let component: BaseTodoItems;
  let fixture: ComponentFixture<BaseTodoItems>;
  let httpMock: HttpTestingController;

  const apiBase = 'http://localhost:6958/api/todo';
  const metaBase = 'http://localhost:6958/api/metadata';

  function flushInit(archived = false) {
    const query = archived ? '?archived=true' : '?hideCompleted=true';
    httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint${query}`).flush({});
    httpMock.expectOne(`${metaBase}/pis`).flush([]);
    httpMock.expectOne(`${metaBase}/sprints`).flush([]);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseTodoItems],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      animationsEnabled: true,
    }).compileComponents();

    fixture = TestBed.createComponent(BaseTodoItems);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    flushInit();
    expect(component).toBeTruthy();
  });

  it('should add archive column when not in archive mode', () => {
    fixture.detectChanges();
    flushInit();
    expect(component.columnsToDisplayWithExpand).toContain('archive');
  });

  it('should NOT add archive column when in archive mode', () => {
    fixture.componentRef.setInput('archive', true);
    fixture.detectChanges();
    flushInit(true);
    expect(component.columnsToDisplayWithExpand).not.toContain('archive');
  });

  it('should start with hideCompletedTasks=true', () => {
    fixture.detectChanges();
    flushInit();
    expect(component.hideCompletedTasks).toBe(true);
  });

  it('should emit pis output with data from metadataApiService', () => {
    const emittedPis: string[][] = [];
    component.pis.subscribe((pis) => emittedPis.push(pis));
    fixture.detectChanges();

    httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=true`).flush({});
    httpMock.expectOne(`${metaBase}/pis`).flush(['PI1', 'PI2']);
    httpMock.expectOne(`${metaBase}/sprints`).flush([]);

    expect(emittedPis).toEqual([['PI1', 'PI2']]);
  });

  it('should emit sprints output with data from metadataApiService', () => {
    const emittedSprints: number[][] = [];
    component.sprints.subscribe((sprints) => emittedSprints.push(sprints));
    fixture.detectChanges();

    httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=true`).flush({});
    httpMock.expectOne(`${metaBase}/pis`).flush([]);
    httpMock.expectOne(`${metaBase}/sprints`).flush([1, 2, 3]);

    expect(emittedSprints).toEqual([[1, 2, 3]]);
  });

  it('should parse the API response into a nested Map keyed by PI then sprint', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=true`).flush({
      PI1: { '1': [makeTodoItem()], '2': [] },
      PI2: { '3': [makeTodoItem({ id: 2, pi: 'PI2', sprint: 3 })] },
    });
    httpMock.expectOne(`${metaBase}/pis`).flush([]);
    httpMock.expectOne(`${metaBase}/sprints`).flush([]);

    expect(component.items).toBeDefined();
    expect(component.items?.has('PI1')).toBe(true);
    expect(component.items?.get('PI1')?.has(1)).toBe(true);
    expect(component.items?.get('PI1')?.get(1)).toHaveLength(1);
    expect(component.items?.get('PI2')?.get(3)).toHaveLength(1);
  });

  it('should subscribe to refreshTodoItems and re-fetch when emitted', () => {
    const refresh$ = new Subject<void>();
    fixture.componentRef.setInput('refreshTodoItems', refresh$);
    fixture.detectChanges();
    flushInit();

    refresh$.next();
    httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=true`).flush({});
  });

  describe('completedCheckboxDisabled', () => {
    beforeEach(() => {
      fixture.detectChanges();
      flushInit();
    });

    it('should return false when item is not completed', () => {
      expect(component.completedCheckboxDisabled(makeTodoItem({ completed: false }))).toBe(false);
    });

    it('should return false when item is completed but not in archive mode', () => {
      expect(component.completedCheckboxDisabled(makeTodoItem({ completed: true }))).toBe(false);
    });

    it('should return true when item is completed and in archive mode', () => {
      fixture.componentRef.setInput('archive', true);
      expect(component.completedCheckboxDisabled(makeTodoItem({ completed: true }))).toBe(true);
    });
  });

  describe('handleHideTasks', () => {
    beforeEach(() => {
      fixture.detectChanges();
      flushInit();
    });

    it('should update hideCompletedTasks and re-fetch items', () => {
      component.handleHideTasks({ checked: false } as MatSlideToggleChange);
      expect(component.hideCompletedTasks).toBe(false);
      httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=false`).flush({});
    });

    it('should re-fetch with hideCompleted=true when toggled back on', () => {
      component.hideCompletedTasks = false;
      component.handleHideTasks({ checked: true } as MatSlideToggleChange);
      expect(component.hideCompletedTasks).toBe(true);
      httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=true`).flush({});
    });
  });

  describe('handleRowExpansion', () => {
    beforeEach(() => {
      fixture.detectChanges();
      flushInit();
    });

    function makeEvent(targetId: string): Event {
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: { id: targetId } });
      return event;
    }

    it('should set expandedElementId to the element id on first click', () => {
      const item = makeTodoItem({ id: 42 });
      component.handleRowExpansion(makeEvent('row-button'), item);
      expect(component.expandedElementId).toBe(42);
    });

    it('should collapse (set to undefined) when clicking the same element again', () => {
      const item = makeTodoItem({ id: 42 });
      component.handleRowExpansion(makeEvent('row-button'), item);
      component.handleRowExpansion(makeEvent('row-button'), item);
      expect(component.expandedElementId).toBeUndefined();
    });

    it('should ignore events triggered by the completed-checkbox', () => {
      const item = makeTodoItem({ id: 42 });
      component.handleRowExpansion(makeEvent('completed-checkbox-1'), item);
      expect(component.expandedElementId).toBeUndefined();
    });

    it('should call stopPropagation when stopPropagation is true', () => {
      const item = makeTodoItem({ id: 10 });
      const event = makeEvent('row-button');
      const stopSpy = vi.spyOn(event, 'stopPropagation');
      component.handleRowExpansion(event, item, true);
      expect(stopSpy).toHaveBeenCalled();
    });
  });

  describe('onCheckboxChange', () => {
    beforeEach(() => {
      fixture.detectChanges();
      flushInit();
    });

    it('should toggle item.completed and call updateTodoItem', () => {
      const item = makeTodoItem({ completed: false });
      component.onCheckboxChange({} as MatCheckboxChange, item);
      expect(item.completed).toBe(true);

      const req = httpMock.expectOne(`${apiBase}/item`);
      expect(req.request.method).toBe('POST');
      req.flush(item);

      httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=true`).flush({});
    });
  });

  describe('handleArchive', () => {
    beforeEach(() => {
      fixture.detectChanges();
      flushInit();
    });

    it('should set archived=true on the item and call updateTodoItem', () => {
      const item = makeTodoItem({ archived: false });
      component.handleArchive(new MouseEvent('click'), item);
      expect(item.archived).toBe(true);

      const req = httpMock.expectOne(`${apiBase}/item`);
      expect(req.request.method).toBe('POST');
      req.flush(item);

      httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=true`).flush({});
    });
  });
});
