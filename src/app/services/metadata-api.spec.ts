import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MetadataApi } from './metadata-api';

describe('MetadataApi', () => {
  let service: MetadataApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MetadataApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
