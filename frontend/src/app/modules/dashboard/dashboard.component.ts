import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page">
      <section class="page-hero">
        <div>
          <p class="eyebrow">Workspace</p>
          <h1>Dashboard</h1>
          <p class="muted">Build, review, and manage your resume profiles from one clean workspace.</p>
        </div>
        <a class="button button-primary" routerLink="/resumes/create">Create Resume</a>
      </section>

      <section class="dashboard-grid">
        <article class="metric-card">
          <span class="metric-label">Profile</span>
        @if (loading) {
            <div class="loading-row"><span class="spinner"></span><span>Loading your profile...</span></div>
        } @else if (user) {
            <h2>{{ user.full_name }}</h2>
            <p class="muted">{{ user.email }}</p>
        } @else {
            <p class="muted">Profile could not be loaded.</p>
        }
        </article>

        <article class="metric-card">
          <span class="metric-label">Resume Flow</span>
          <h2>7 steps</h2>
          <p class="muted">Personal details, education, experience, skills, projects, certifications, and review.</p>
        </article>

        <article class="metric-card">
          <span class="metric-label">Next Action</span>
          <h2>Manage resumes</h2>
          <p class="muted">Open your resume list to continue editing or reviewing.</p>
          <a class="button button-outline" routerLink="/resumes">My Resumes</a>
        </article>
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
