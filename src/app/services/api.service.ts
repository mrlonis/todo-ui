import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoItem } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpClient = inject(HttpClient);

  private baseUrl = 'http://localhost:8080';
  private route = 'api/todo';
  private routeUrl = `${this.baseUrl}/${this.route}`;

  getTodoItems(): Observable<TodoItem[]> {
    return this.httpClient.get<TodoItem[]>(`${this.routeUrl}/items`);
  }

  createTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.httpClient.post<TodoItem>(`${this.routeUrl}/item`, todoItem);
  }

  getTodoItemsByPi(): Observable<Record<string, TodoItem[]>> {
    return this.httpClient.get<Record<string, TodoItem[]>>(`${this.routeUrl}/itemsByPi`);
  }

  getTodoItemsByPiAndBySprint(
    hideCompleted: boolean,
    archived: boolean,
  ): Observable<Record<string, Record<string, TodoItem[]>>> {
    let routeUrl = `${this.routeUrl}/itemsByPiAndBySprint`;
    if (archived) {
      routeUrl += '?archived=true';
    } else {
      routeUrl += `?hideCompleted=${hideCompleted}`;
    }

    return this.httpClient.get<Record<string, Record<string, TodoItem[]>>>(routeUrl);
  }

  updateTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.httpClient.post<TodoItem>(`${this.routeUrl}/item`, todoItem);
  }
}
