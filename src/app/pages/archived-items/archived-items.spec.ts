import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchivedItemsPage } from './archived-items';

describe('ArchivedItemsPage', () => {
  let component: ArchivedItemsPage;
  let fixture: ComponentFixture<ArchivedItemsPage>;
  let httpMock: HttpTestingController;

  const apiBase = 'http://localhost:6958/api/todo';
  const metaBase = 'http://localhost:6958/api/metadata';

  function flushInit() {
    httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?archived=true`).flush({});
    httpMock.expectOne(`${metaBase}/pis`).flush([]);
    httpMock.expectOne(`${metaBase}/sprints`).flush([]);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedItemsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivedItemsPage);
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

  it('should render app-base-todo-items', () => {
    fixture.detectChanges();
    flushInit();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-base-todo-items')).toBeTruthy();
  });

  it('should fetch items with archived=true (not hideCompleted)', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${apiBase}/itemsByPiAndBySprint?archived=true`).flush({});
    httpMock.expectOne(`${metaBase}/pis`).flush([]);
    httpMock.expectOne(`${metaBase}/sprints`).flush([]);
  });
});
