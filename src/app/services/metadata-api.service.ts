import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetadataApiService {
  private httpClient = inject(HttpClient);

  private baseUrl = 'http://localhost:8080';
  private route = 'api/metadata';
  private routeUrl = `${this.baseUrl}/${this.route}`;

  getAllPis(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.routeUrl}/pis`);
  }

  getAllSprints(): Observable<number[]> {
    return this.httpClient.get<number[]>(`${this.routeUrl}/sprints`);
  }
}
