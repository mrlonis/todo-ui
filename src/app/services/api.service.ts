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

  createTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.httpClient.post<TodoItem>('http://localhost:8080/api/todo/item', todoItem);
  }

  getTodoItemsByPi(): Observable<Record<string, TodoItem[]>> {
    return this.httpClient.get<Record<string, TodoItem[]>>('http://localhost:8080/api/todo/itemsByPi');
  }

  getTodoItemsByPiAndBySprint(): Observable<Record<string, Record<number, TodoItem[]>>> {
    return this.httpClient.get<Record<string, Record<number, TodoItem[]>>>(
      'http://localhost:8080/api/todo/itemsByPiAndBySprint',
    );
  }
}
