import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MetadataApi } from './metadata-api';

describe('MetadataApi', () => {
  let service: MetadataApi;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:6958/api/metadata';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MetadataApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPis', () => {
    it('should GET /pis and return a string array', () => {
      const pis = ['PI1', 'PI2', 'PI3'];
      let result: string[] | undefined;

      service.getAllPis().subscribe((data) => (result = data));

      const req = httpMock.expectOne(`${baseUrl}/pis`);
      expect(req.request.method).toBe('GET');
      req.flush(pis);

      expect(result).toEqual(pis);
    });

    it('should return an empty array when no PIs exist', () => {
      let result: string[] | undefined;

      service.getAllPis().subscribe((data) => (result = data));

      httpMock.expectOne(`${baseUrl}/pis`).flush([]);

      expect(result).toEqual([]);
    });
  });

  describe('getAllSprints', () => {
    it('should GET /sprints and return a number array', () => {
      const sprints = [1, 2, 3, 4];
      let result: number[] | undefined;

      service.getAllSprints().subscribe((data) => (result = data));

      const req = httpMock.expectOne(`${baseUrl}/sprints`);
      expect(req.request.method).toBe('GET');
      req.flush(sprints);

      expect(result).toEqual(sprints);
    });

    it('should return an empty array when no sprints exist', () => {
      let result: number[] | undefined;

      service.getAllSprints().subscribe((data) => (result = data));

      httpMock.expectOne(`${baseUrl}/sprints`).flush([]);

      expect(result).toEqual([]);
    });
  });
});
