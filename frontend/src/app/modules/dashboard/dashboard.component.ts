import { Component, OnInit, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <main class="page">
      <section class="dashboard-panel">
        <h1>Dashboard</h1>

        @if (loading) {
          <p class="muted">Loading your profile...</p>
        } @else if (user) {
          <p>Welcome, <strong>{{ user.full_name }}</strong>.</p>
          <p class="muted">Email: {{ user.email }}</p>
        } @else {
          <p class="muted">Profile could not be loaded.</p>
        }
      </section>
    </main>
  `
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);

  loading = true;
  user?: User;

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.authService.logout();
      }
    });
  }
}
