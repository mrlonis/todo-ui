import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoItem } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  getTodoItems(): Observable<TodoItem[]> {
    return this.httpClient.get<TodoItem[]>('http://localhost:8080/api/todo/items');
  }
}
