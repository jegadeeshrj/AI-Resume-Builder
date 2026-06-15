import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ResumeService } from '../services/resume.service';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="wizard-bar"><strong>Step 1 of 7</strong><span class="muted">Personal Details</span></section>
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
        <div class="section-heading">
          <div>
            <h1>Personal Details</h1>
            <p class="muted">Add the contact information shown at the top of your resume.</p>
          </div>
        </div>
        @if (serverError) { <div class="alert alert-danger">{{ serverError }}</div> }
        @if (successMessage) { <div class="alert alert-success">{{ successMessage }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid">
            <div class="form-row">
              <label>First name</label>
              <input formControlName="first_name" placeholder="Alex">
              @if (form.controls.first_name.touched && form.controls.first_name.invalid) { <div class="error">First name is required.</div> }
            </div>
            <div class="form-row">
              <label>Last name</label>
              <input formControlName="last_name" placeholder="Taylor">
              @if (form.controls.last_name.touched && form.controls.last_name.invalid) { <div class="error">Last name is required.</div> }
            </div>
            <div class="form-row">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="alex@example.com">
              @if (form.controls.email.touched && form.controls.email.invalid) { <div class="error">Enter a valid email address.</div> }
            </div>
            <div class="form-row">
              <label>Phone</label>
              <input formControlName="phone" placeholder="+1 555 123 4567">
              @if (form.controls.phone.touched && form.controls.phone.invalid) { <div class="error">Enter a valid phone number.</div> }
            </div>
            <div class="form-row"><label>LinkedIn</label><input type="url" formControlName="linkedin_url" placeholder="https://linkedin.com/in/username"></div>
            <div class="form-row"><label>GitHub</label><input type="url" formControlName="github_url" placeholder="https://github.com/username"></div>
            <div class="form-row"><label>Portfolio</label><input type="url" formControlName="portfolio_url" placeholder="https://yourportfolio.com"></div>
            <div class="form-row"><label>Address</label><input formControlName="address" placeholder="Street address"></div>
            <div class="form-row"><label>City</label><input formControlName="city" placeholder="Austin"></div>
            <div class="form-row"><label>State</label><input formControlName="state" placeholder="Texas"></div>
            <div class="form-row"><label>Country</label><input formControlName="country" placeholder="United States"></div>
            <div class="form-row"><label>Postal code</label><input formControlName="postal_code" placeholder="78701"></div>
          </div>
          @if (form.touched && form.invalid) {
            <div class="error">Required fields, email, phone, and URLs must be valid.</div>
          }
          <div class="actions form-actions">
            <button class="button button-primary" type="submit" [disabled]="form.invalid || loading">
              @if (loading) { <span class="spinner light"></span> }
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
            <a class="button button-outline" [routerLink]="['/resumes', resumeId, 'education']">Next</a>
          </div>
        </form>
      </section>
    </main>
  `
})
export class PersonalDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private resumeService = inject(ResumeService);

  resumeId = Number(this.route.snapshot.paramMap.get('id'));
  loading = false;
  exists = false;
  serverError = '';
  successMessage = '';
  urlPattern = /^https?:\/\/.+/;

  form = this.fb.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s().]{7,30}$/)]],
    linkedin_url: ['', Validators.pattern(this.urlPattern)],
    github_url: ['', Validators.pattern(this.urlPattern)],
    portfolio_url: ['', Validators.pattern(this.urlPattern)],
    address: [''],
    city: [''],
    state: [''],
    country: [''],
    postal_code: ['']
  });

  ngOnInit(): void {
    this.resumeService.getPersonalDetails(this.resumeId).subscribe({
      next: (details) => {
        this.exists = true;
        this.form.patchValue({
          first_name: details.first_name,
          last_name: details.last_name,
          email: details.email,
          phone: details.phone,
          linkedin_url: details.linkedin_url ?? '',
          github_url: details.github_url ?? '',
          portfolio_url: details.portfolio_url ?? '',
          address: details.address ?? '',
          city: details.city ?? '',
          state: details.state ?? '',
          country: details.country ?? '',
          postal_code: details.postal_code ?? ''
        });
      },
      error: () => undefined
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.serverError = '';
    this.successMessage = '';
    const request = this.exists
      ? this.resumeService.updatePersonalDetails(this.resumeId, this.form.getRawValue())
      : this.resumeService.createPersonalDetails(this.resumeId, this.form.getRawValue());
    request.subscribe({
      next: () => {
        this.exists = true;
        this.loading = false;
        this.successMessage = 'Personal details saved successfully.';
      },
      error: (error) => {
        this.serverError = error.error?.detail ?? 'Personal details could not be saved.';
        this.loading = false;
      }
    });
  }
}
