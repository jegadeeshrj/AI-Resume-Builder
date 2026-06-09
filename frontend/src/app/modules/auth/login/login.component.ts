import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="auth-panel">
        <h1>Login</h1>
        <p class="muted">Sign in to continue to your dashboard.</p>

        @if (serverError) {
          <div class="alert alert-danger">{{ serverError }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email">
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <div class="error">Enter a valid email address.</div>
            }
          </div>

          <div class="form-row">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password">
            @if (form.controls.password.touched && form.controls.password.invalid) {
              <div class="error">Password is required.</div>
            }
          </div>

          <button class="button button-primary" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p class="muted">No account yet? <a routerLink="/register">Register here</a>.</p>
      </section>
    </main>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  serverError = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.serverError = '';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error) => {
        this.serverError = error.error?.detail ?? 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
