import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  navLinks: NavItem[] = [
    { link: '/', display: 'Home' },
    { link: '/archive', display: 'Archive' },
  ];

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    try {
      this.mobileQuery.addEventListener('change', () => {
        this._mobileQueryListener();
      });
    } catch (e) {
      console.error(e);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      this.mobileQuery.addListener(this._mobileQueryListener);
    }
  }

  ngOnDestroy(): void {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
