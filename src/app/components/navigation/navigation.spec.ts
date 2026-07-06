import { MediaMatcher } from '@angular/cdk/layout';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { Navigation } from './navigation';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  const mockMQ = {
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    media: '(max-width: 600px)',
    onchange: null,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MediaMatcher, useValue: { matchMedia: vi.fn().mockReturnValue(mockMQ) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define exactly two nav links', () => {
    expect(component.navLinks).toHaveLength(2);
  });

  it('should have a Home nav link pointing to /', () => {
    expect(component.navLinks[0]).toEqual({ link: '/', display: 'Home' });
  });

  it('should have an Archive nav link pointing to /archive', () => {
    expect(component.navLinks[1]).toEqual({ link: '/archive', display: 'Archive' });
  });

  it('should initialize mobileQuery on construction', () => {
    expect(component.mobileQuery).toBeDefined();
  });

  it('should register a media query change listener on construction', () => {
    expect(mockMQ.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should not throw when destroyed', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
