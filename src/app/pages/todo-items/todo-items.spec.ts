import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import type { MockInstance } from 'vitest';
import { AddNewPiDialog } from '../../components/add-new-pi-dialog/add-new-pi-dialog';
import { AddNewSprintDialog } from '../../components/add-new-sprint-dialog/add-new-sprint-dialog';
import { CreateItemDialog } from '../../components/create-item-dialog/create-item-dialog';
import { TodoItem } from '../../interfaces/todo-item';
import { TodoItemsPage } from './todo-items';

const makeTodoItem = (): TodoItem => ({
  id: 1,
  title: 'Test',
  prUrls: [],
  urlsUsedForTesting: [],
  completed: false,
  createdOn: '2024-01-01',
  pi: 'PI1',
  sprint: 1,
  type: 'ASSIGNED',
  archived: false,
});

describe('TodoItemsPage', () => {
  let component: TodoItemsPage;
  let fixture: ComponentFixture<TodoItemsPage>;
  let httpMock: HttpTestingController;
  type DialogOpenFn = (...args: unknown[]) => MatDialogRef<unknown>;
  let dialogOpenSpy: MockInstance<DialogOpenFn>;

  const apiBase = 'http://localhost:6958/api/todo';
  const metaBase = 'http://localhost:6958/api/metadata';

  function flushInit() {
    httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=true`).flush({});
    httpMock.expectOne(`${metaBase}/pis`).flush([]);
    httpMock.expectOne(`${metaBase}/sprints`).flush([]);
  }

  function mockDialog(result: unknown): void {
    dialogOpenSpy.mockReturnValue({ afterClosed: () => of(result) } as MatDialogRef<unknown>);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemsPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    dialogOpenSpy = vi.spyOn(component.dialog, 'open');

    fixture.detectChanges();
    flushInit();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty pis and sprints', () => {
    expect(component.pis()).toEqual([]);
    expect(component.sprints()).toEqual([]);
  });

  describe('setPis', () => {
    it('should update the pis array', () => {
      component.setPis(['PI1', 'PI2']);
      expect(component.pis()).toEqual(['PI1', 'PI2']);
    });
  });

  describe('setSprints', () => {
    it('should update the sprints array', () => {
      component.setSprints([1, 2, 3]);
      expect(component.sprints()).toEqual([1, 2, 3]);
    });
  });

  describe('openDialog', () => {
    it('should open CreateItemDialog with the current pis and sprints', () => {
      component.pis.set(['PI1']);
      component.sprints.set([1]);
      mockDialog(undefined);

      component.openDialog();

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        CreateItemDialog,
        expect.objectContaining({ data: { pis: ['PI1'], sprints: [1] } }),
      );
    });

    it('should call createTodoItem when dialog returns a result', () => {
      const item = makeTodoItem();
      mockDialog(item);

      component.openDialog();

      const req = httpMock.expectOne(`${apiBase}/item`);
      expect(req.request.method).toBe('POST');
      req.flush(item);

      httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?hideCompleted=true`).flush({});
    });

    it('should not call createTodoItem when dialog is cancelled', () => {
      mockDialog(undefined);

      component.openDialog();

      httpMock.expectNone(`${apiBase}/item`);
    });
  });

  describe('openNewPiDialog', () => {
    it('should open AddNewPiDialog', () => {
      mockDialog(undefined);

      component.openNewPiDialog();

      expect(dialogOpenSpy).toHaveBeenCalledWith(AddNewPiDialog, expect.any(Object));
    });

    it('should append the returned PI to the pis array', () => {
      component.pis.set(['PI1']);
      mockDialog('PI2');

      component.openNewPiDialog();

      expect(component.pis()).toEqual(['PI1', 'PI2']);
    });

    it('should not modify pis when the dialog is cancelled', () => {
      component.pis.set(['PI1']);
      mockDialog(undefined);

      component.openNewPiDialog();

      expect(component.pis()).toEqual(['PI1']);
    });
  });

  describe('openNewSprintDialog', () => {
    it('should open AddNewSprintDialog', () => {
      mockDialog(undefined);

      component.openNewSprintDialog();

      expect(dialogOpenSpy).toHaveBeenCalledWith(AddNewSprintDialog, expect.any(Object));
    });

    it('should append a numeric result to the sprints array', () => {
      component.sprints.set([1]);
      mockDialog(2);

      component.openNewSprintDialog();

      expect(component.sprints()).toEqual([1, 2]);
    });

    it('should parse a string result to a number before appending', () => {
      component.sprints.set([]);
      mockDialog('3');

      component.openNewSprintDialog();

      expect(component.sprints()).toEqual([3]);
    });

    it('should not modify sprints when the dialog is cancelled (undefined result)', () => {
      component.sprints.set([1]);
      mockDialog(undefined);

      component.openNewSprintDialog();

      expect(component.sprints()).toEqual([1]);
    });

    it('should not modify sprints when result is NaN', () => {
      component.sprints.set([1]);
      mockDialog('not-a-number');

      component.openNewSprintDialog();

      expect(component.sprints()).toEqual([1]);
    });
  });
});
