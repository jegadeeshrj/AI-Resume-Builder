import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="auth-panel">
        <h1>Forgot Password</h1>
        <p class="muted">Enter your account email and we will send a password reset link if it exists.</p>

        @if (successMessage) {
          <div class="alert alert-success">{{ successMessage }}</div>
        }
        @if (serverError) {
          <div class="alert alert-danger">{{ serverError }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" placeholder="user@example.com">
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <div class="error">Enter a valid email address.</div>
            }
          </div>

          <button class="button button-primary" type="submit" [disabled]="form.invalid || loading">
            @if (loading) { <span class="spinner light"></span> }
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <p class="muted">Remember your password? <a routerLink="/login">Back to login</a>.</p>
      </section>
    </main>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loading = false;
  successMessage = '';
  serverError = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.serverError = '';

    this.authService.forgotPassword(this.form.controls.email.value).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.loading = false;
      },
      error: () => {
        this.serverError = 'Unable to send reset link. Please try again.';
        this.loading = false;
      }
    });
  }
}
