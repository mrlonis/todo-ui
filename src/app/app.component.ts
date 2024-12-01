import { Component } from '@angular/core';
import { NavigationComponent } from './components';

@Component({
  selector: 'app-root',
  imports: [NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'todo-ui';
}
