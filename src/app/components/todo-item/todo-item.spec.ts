import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItem } from '../../interfaces/todo-item';
import { TodoItemComponent } from './todo-item';

const makeTodoItem = (overrides: Partial<TodoItem> = {}): TodoItem => ({
  id: 1,
  title: 'Test Item',
  prUrls: ['https://github.com/pr/1', 'https://github.com/pr/2'],
  urlsUsedForTesting: ['https://test.example.com'],
  completed: true,
  createdOn: '2024-01-01',
  pi: 'PI1',
  sprint: 1,
  type: 'ASSIGNED',
  archived: false,
  jiraUrl: 'https://jira.example.com/JIRA-1',
  cloudForgeConsoleUrl: 'https://forge.example.com/console',
  releaseRequestUrl: 'https://release.example.com/req/1',
  oneNoteUrl: 'https://onenote.example.com/note',
  ...overrides,
});

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render "No item found" when no item is provided', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('No item found');
  });

  it('should not render "No item found" when an item is provided', () => {
    fixture.componentRef.setInput('item', makeTodoItem());
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).not.toContain('No item found');
  });

  it('should render the jira URL', () => {
    const item = makeTodoItem();
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(item.jiraUrl);
  });

  it('should render all PR URLs', () => {
    const item = makeTodoItem();
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    for (const url of item.prUrls) {
      expect(text).toContain(url);
    }
  });

  it('should render all testing URLs', () => {
    const item = makeTodoItem();
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    for (const url of item.urlsUsedForTesting) {
      expect(text).toContain(url);
    }
  });

  it('should render the CloudForge console URL', () => {
    const item = makeTodoItem();
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(item.cloudForgeConsoleUrl);
  });

  it('should render the OneNote URL', () => {
    const item = makeTodoItem();
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(item.oneNoteUrl);
  });

  it('should render the completed status', () => {
    const item = makeTodoItem({ completed: true });
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('true');
  });
});
