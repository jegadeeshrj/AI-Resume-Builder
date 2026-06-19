import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    @if (authService.isLoggedIn()) {
      <div class="app-shell">
        <aside class="sidebar">
          <a class="sidebar-brand" routerLink="/dashboard">
            <span class="brand-mark">AI</span>
            <span>Resume Builder</span>
          </a>
          <nav class="sidebar-nav">
            <a routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
            <a routerLink="/resumes" routerLinkActive="active-link">My Resumes</a>
            <a routerLink="/resumes/create" routerLinkActive="active-link">Create Resume</a>
            <button type="button" (click)="logout()">Logout</button>
          </nav>
        </aside>

        <div class="app-main">
          <header class="top-nav">
            <a class="brand" routerLink="/dashboard">AI Resume Builder</a>
            <div class="nav-actions">
              <span class="user-chip">{{ authService.getUserName() }}</span>
            </div>
          </header>
          <router-outlet></router-outlet>
        </div>
      </div>
    } @else {
      <nav class="top-nav auth-nav">
        <a class="brand" routerLink="/login">AI Resume Builder</a>
        <div class="nav-actions">
          <a class="button button-outline" routerLink="/login">Login</a>
          <a class="button button-primary" routerLink="/register">Register</a>
        </div>
      </nav>
      <router-outlet></router-outlet>
    }
  `
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.me().subscribe({ error: () => undefined });
    }
  }


  logout(): void {
    this.authService.logout();
  }
}
