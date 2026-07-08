import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';

export interface NavItem {
  link: string;
  display: string;
}

@Component({
  selector: 'app-navigation',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation implements OnDestroy {
  mobileQuery: MediaQueryList;
  readonly mobileMatches = signal(false);

  readonly navLinks: NavItem[] = [
    { link: '/', display: 'Home' },
    { link: '/archive', display: 'Archive' },
  ];

  private _mobileQueryListener: (event: MediaQueryListEvent) => void;

  constructor() {
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileMatches.set(this.mobileQuery.matches);
    this._mobileQueryListener = () => this.mobileMatches.set(this.mobileQuery.matches);
    try {
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    } catch (e) {
      console.error(e);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      this.mobileQuery.addListener(this._mobileQueryListener);
    }
  }

  ngOnDestroy(): void {
    try {
      this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    } catch (e) {
      console.error(e);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }
  }
}
