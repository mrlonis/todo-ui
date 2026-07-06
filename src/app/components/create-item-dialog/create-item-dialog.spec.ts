import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateItemDialog } from './create-item-dialog';

describe('CreateItemDialog', () => {
  let component: CreateItemDialog;
  let fixture: ComponentFixture<CreateItemDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateItemDialog],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: { pis: ['PI1', 'PI2'], sprints: [1, 2] } },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateItemDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pis and sprints from dialog data', () => {
    expect(component.pis).toEqual(['PI1', 'PI2']);
    expect(component.sprints).toEqual([1, 2]);
  });

  it('should have an invalid form initially because required fields are empty', () => {
    expect(component.createItemDialogForm.valid).toBe(false);
  });

  describe('getTodoItem', () => {
    it('should build a TodoItem from the current form values', () => {
      component.createItemDialogForm.patchValue({
        titleFormControl: 'Test Task',
        piFormControl: 'PI1',
        sprintFormControl: 1,
        typeFormControl: 'BUG',
        jiraUrlFormControl: 'https://jira.example.com/JIRA-1',
      });

      const item = component.getTodoItem();
      expect(item.title).toBe('Test Task');
      expect(item.pi).toBe('PI1');
      expect(item.sprint).toBe(1);
      expect(item.type).toBe('BUG');
      expect(item.jiraUrl).toBe('https://jira.example.com/JIRA-1');
      expect(item.completed).toBe(false);
      expect(item.prUrls).toEqual([]);
      expect(item.urlsUsedForTesting).toEqual([]);
    });

    it('should set jiraUrl to undefined when the field is null', () => {
      component.createItemDialogForm.patchValue({
        titleFormControl: 'Test',
        piFormControl: 'PI1',
        sprintFormControl: 1,
        jiraUrlFormControl: null,
      });
      expect(component.getTodoItem().jiraUrl).toBeUndefined();
    });

    it('should set cloudForgeConsoleUrl to undefined when null', () => {
      component.createItemDialogForm.patchValue({
        titleFormControl: 'Test',
        piFormControl: 'PI1',
        sprintFormControl: 1,
        cloudForgeConsoleUrl: null,
      });
      expect(component.getTodoItem().cloudForgeConsoleUrl).toBeUndefined();
    });

    it('should include PR urls that have a value', () => {
      vi.useFakeTimers();
      component.addNewPrUrl();
      vi.runAllTimers();
      vi.useRealTimers();

      const controls = component.getPrUrlFormControlsAsArray();
      controls[0].control.setValue('https://github.com/pr/1');

      component.createItemDialogForm.patchValue({
        titleFormControl: 'Test',
        piFormControl: 'PI1',
        sprintFormControl: 1,
      });

      expect(component.getTodoItem().prUrls).toEqual(['https://github.com/pr/1']);
    });
  });

  describe('addNewPrUrl / removePrUrl', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('addNewPrUrl adds a form control after the timeout', () => {
      expect(component.getPrUrlFormControlsAsArray()).toHaveLength(0);
      component.addNewPrUrl();
      vi.runAllTimers();
      expect(component.getPrUrlFormControlsAsArray()).toHaveLength(1);
    });

    it('addNewPrUrl increments the control name counter', () => {
      component.addNewPrUrl();
      vi.runAllTimers();
      component.addNewPrUrl();
      vi.runAllTimers();
      const controls = component.getPrUrlFormControlsAsArray();
      expect(controls).toHaveLength(2);
      expect(controls[0].name).toBe('prUrlFormControl1');
      expect(controls[1].name).toBe('prUrlFormControl2');
    });

    it('removePrUrl removes the named form control', () => {
      component.addNewPrUrl();
      vi.runAllTimers();
      const name = component.getPrUrlFormControlsAsArray()[0].name;
      component.removePrUrl(name);
      expect(component.getPrUrlFormControlsAsArray()).toHaveLength(0);
    });

    it('removePrUrl is a no-op when the name does not exist', () => {
      component.removePrUrl('nonexistent');
      expect(component.getPrUrlFormControlsAsArray()).toHaveLength(0);
    });
  });

  describe('addNewTestingUrl / removeTestingUrl', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('addNewTestingUrl adds a form control after the timeout', () => {
      expect(component.getUrlsUsedForTestingFormControlsAsArray()).toHaveLength(0);
      component.addNewTestingUrl();
      vi.runAllTimers();
      expect(component.getUrlsUsedForTestingFormControlsAsArray()).toHaveLength(1);
    });

    it('addNewTestingUrl increments the control name counter', () => {
      component.addNewTestingUrl();
      vi.runAllTimers();
      component.addNewTestingUrl();
      vi.runAllTimers();
      const controls = component.getUrlsUsedForTestingFormControlsAsArray();
      expect(controls).toHaveLength(2);
      expect(controls[0].name).toBe('testingUrlFormControl1');
      expect(controls[1].name).toBe('testingUrlFormControl2');
    });

    it('removeTestingUrl removes the named form control', () => {
      component.addNewTestingUrl();
      vi.runAllTimers();
      const name = component.getUrlsUsedForTestingFormControlsAsArray()[0].name;
      component.removeTestingUrl(name);
      expect(component.getUrlsUsedForTestingFormControlsAsArray()).toHaveLength(0);
    });

    it('removeTestingUrl is a no-op when the name does not exist', () => {
      component.removeTestingUrl('nonexistent');
      expect(component.getUrlsUsedForTestingFormControlsAsArray()).toHaveLength(0);
    });
  });
});
