import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MetadataApiService } from './metadata-api.service';

describe('MetadataApiService', () => {
  let service: MetadataApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MetadataApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
