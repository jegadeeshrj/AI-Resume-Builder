import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="auth-panel">
        <h1>Reset Password</h1>
        <p class="muted">Create a new password for your AI Resume Builder account.</p>

        @if (successMessage) {
          <div class="alert alert-success">{{ successMessage }}</div>
        }
        @if (serverError) {
          <div class="alert alert-danger">{{ serverError }}</div>
        }

        @if (!token) {
          <div class="alert alert-danger">Reset token is missing. Please request a new password reset link.</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <label for="newPassword">New password</label>
            <input id="newPassword" type="password" formControlName="newPassword" placeholder="Minimum 8 characters">
            @if (form.controls.newPassword.touched && form.controls.newPassword.invalid) {
              <div class="error">Password must be at least 8 characters.</div>
            }
          </div>

          <div class="form-row">
            <label for="confirmPassword">Confirm password</label>
            <input id="confirmPassword" type="password" formControlName="confirmPassword" placeholder="Re-enter new password">
            @if (form.controls.confirmPassword.touched && form.controls.confirmPassword.invalid) {
              <div class="error">Confirm password is required.</div>
            }
            @if (form.touched && form.errors?.['passwordMismatch']) {
              <div class="error">Passwords do not match.</div>
            }
          </div>

          <button class="button button-primary" type="submit" [disabled]="form.invalid || loading || !token">
            @if (loading) { <span class="spinner light"></span> }
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>

        <p class="muted"><a routerLink="/login">Back to login</a></p>
      </section>
    </main>
  `
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  token = this.route.snapshot.queryParamMap.get('token') ?? '';
  loading = false;
  successMessage = '';
  serverError = '';

  form = this.fb.nonNullable.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordMatchValidator }
  );

  submit(): void {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.serverError = '';
    const { newPassword, confirmPassword } = this.form.getRawValue();

    this.authService.resetPassword(this.token, newPassword, confirmPassword).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (error) => {
        this.serverError = error.error?.detail ?? 'Password could not be reset. Please request a new link.';
        this.loading = false;
      }
    });
  }
}
