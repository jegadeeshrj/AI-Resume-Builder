import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="auth-panel">
        <h1>Register</h1>
        <p class="muted">Create your account for AI Resume Builder.</p>

        @if (serverError) {
          <div class="alert alert-danger">{{ serverError }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <label for="full_name">Full name</label>
            <input id="full_name" type="text" formControlName="full_name">
            @if (form.controls.full_name.touched && form.controls.full_name.invalid) {
              <div class="error">Full name must be at least 2 characters.</div>
            }
          </div>

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
              <div class="error">Password must be at least 8 characters.</div>
            }
          </div>

          <button class="button button-primary" type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>
        </form>

        <p class="muted">Already have an account? <a routerLink="/login">Login here</a>.</p>
      </section>
    </main>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  serverError = '';

  form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.serverError = '';

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => {
        this.serverError = error.error?.detail ?? 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
