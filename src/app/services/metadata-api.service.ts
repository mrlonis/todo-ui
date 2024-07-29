import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetadataApiService {
  private baseUrl = 'http://localhost:8080';
  private route = 'api/metadata';
  private routeUrl = `${this.baseUrl}/${this.route}`;

  constructor(private httpClient: HttpClient) {}

  getAllPis(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.routeUrl}/pis`);
  }

  getAllSprints(): Observable<number[]> {
    return this.httpClient.get<number[]>(`${this.routeUrl}/sprints`);
  }
}
