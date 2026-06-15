import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ResumeService } from '../services/resume.service';

@Component({
  selector: 'app-resume-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="page-hero compact">
        <div>
          <p class="eyebrow">New Resume</p>
          <h1>Create Resume</h1>
          <p class="muted">Start with a title and summary, then move through the guided resume wizard.</p>
        </div>
      </section>

      <section class="wizard-steps">
        <span class="active">1. Personal Details</span>
        <span>2. Education</span>
        <span>3. Experience</span>
        <span>4. Skills</span>
        <span>5. Projects</span>
        <span>6. Certifications</span>
        <span>7. Review</span>
      </section>

      <section class="form-panel">
        @if (serverError) {
          <div class="alert alert-danger">{{ serverError }}</div>
        }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-row">
            <label for="resume_title">Resume title</label>
            <input id="resume_title" formControlName="resume_title" placeholder="Example: Frontend Developer Resume">
            @if (form.controls.resume_title.touched && form.controls.resume_title.invalid) {
              <div class="error">Resume title is required.</div>
            }
          </div>
          <div class="form-row">
            <label for="professional_summary">Professional summary</label>
            <textarea id="professional_summary" formControlName="professional_summary" placeholder="Write a concise summary of your professional background."></textarea>
          </div>
          <div class="actions">
            <button class="button button-primary" type="submit" [disabled]="form.invalid || loading">
              @if (loading) { <span class="spinner light"></span> }
              {{ loading ? 'Creating...' : 'Create and Continue' }}
            </button>
            <a class="button button-outline" routerLink="/resumes">Cancel</a>
          </div>
        </form>
      </section>
    </main>
  `
})
export class ResumeCreateComponent {
  private fb = inject(FormBuilder);
  private resumeService = inject(ResumeService);
  private router = inject(Router);

  loading = false;
  serverError = '';

  form = this.fb.nonNullable.group({
    resume_title: ['', Validators.required],
    professional_summary: ['']
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.resumeService.create(this.form.getRawValue()).subscribe({
      next: (resume) => this.router.navigate(['/resumes', resume.id, 'personal-details']),
      error: (error) => {
        this.serverError = error.error?.detail ?? 'Resume could not be created.';
        this.loading = false;
      }
    });
  }
}
