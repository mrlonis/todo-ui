import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent, PageNotFoundComponent } from './components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, PageNotFoundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'todo-ui';
}
