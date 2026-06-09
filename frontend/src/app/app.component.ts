import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav class="top-nav">
      <a class="brand" routerLink="/dashboard">AI Resume Builder</a>
      <div class="nav-actions">
        @if (authService.isLoggedIn()) {
          <a class="button button-outline" routerLink="/dashboard">Dashboard</a>
          <button class="button button-outline" type="button" (click)="logout()">Logout</button>
        } @else {
          <a class="button button-outline" routerLink="/login">Login</a>
          <a class="button button-primary" routerLink="/register">Register</a>
        }
      </div>
    </nav>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
