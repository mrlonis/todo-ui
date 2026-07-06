import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchivedItemsPage } from './archived-items';

describe('ArchivedItemsPage', () => {
  let component: ArchivedItemsPage;
  let fixture: ComponentFixture<ArchivedItemsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedItemsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivedItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
