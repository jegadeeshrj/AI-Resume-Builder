import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Experience } from '../../../shared/models/resume.model';
import { ExperienceService } from '../services/experience.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="wizard-bar"><strong>Step 3 of 7</strong><span class="muted">Experience</span></section>
      <section class="wizard-steps">
        <span>1. Personal Details</span><span>2. Education</span><span class="active">3. Experience</span><span>4. Skills</span><span>5. Projects</span><span>6. Certifications</span><span>7. Review</span>
      </section>
      <section class="form-panel">
        <div class="section-heading">
          <div><h1>Experience</h1><p class="muted">Add work history, roles, and measurable impact.</p></div>
        </div>
        @if (successMessage) { <div class="alert alert-success">{{ successMessage }}</div> }
        @if (serverError) { <div class="alert alert-danger">{{ serverError }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid">
            <div class="form-row"><label>Company</label><input formControlName="company_name" placeholder="Example Inc">@if (form.controls.company_name.touched && form.controls.company_name.invalid) { <div class="error">Company is required.</div> }</div>
            <div class="form-row"><label>Job title</label><input formControlName="job_title" placeholder="Software Engineer">@if (form.controls.job_title.touched && form.controls.job_title.invalid) { <div class="error">Job title is required.</div> }</div>
            <div class="form-row"><label>Employment type</label><input formControlName="employment_type" placeholder="Full-time"></div>
            <div class="form-row"><label>Start date</label><input type="date" formControlName="start_date"></div>
            <div class="form-row"><label>End date</label><input type="date" formControlName="end_date"></div>
            <label class="check-row"><input type="checkbox" formControlName="currently_working"> Currently working</label>
          </div>
          <div class="form-row"><label>Description</label><textarea formControlName="description" placeholder="Describe responsibilities, achievements, and technologies used."></textarea></div>
          <div class="actions form-actions"><button class="button button-primary" [disabled]="form.invalid || saving">@if (saving) { <span class="spinner light"></span> } {{ saving ? 'Saving...' : editingId ? 'Update Experience' : 'Add Experience' }}</button><button class="button button-outline" type="button" (click)="resetForm()">Clear</button><a class="button button-outline" [routerLink]="['/resumes', resumeId, 'education']">Previous</a><a class="button button-outline" [routerLink]="['/resumes', resumeId, 'skills']">Next</a></div>
        </form>
      </section>
      <section class="section-heading list-heading"><h2>Saved Experience</h2></section>
      @if (loading) {
        <section class="surface-panel"><div class="loading-row"><span class="spinner"></span><span>Loading experience...</span></div></section>
      } @else {
        <section class="grid-list">@for (item of items; track item.id) { <article class="item-card"><h2>{{ item.job_title }}</h2><p>{{ item.company_name }}</p><p class="muted">{{ item.employment_type || 'Employment type not set' }}</p><p class="muted">{{ item.start_date || '' }} - {{ item.currently_working ? 'Present' : item.end_date || '' }}</p><div class="actions card-actions"><button class="button button-outline" type="button" (click)="edit(item)">Edit</button><button class="button button-danger" type="button" (click)="delete(item.id)">Delete</button></div></article> } @empty { <article class="empty-state compact"><p class="muted">No experience entries added yet.</p></article> }</section>
      }
    </main>
  `
})
export class ExperienceComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(ExperienceService);

  resumeId = Number(this.route.snapshot.paramMap.get('id'));
  items: Experience[] = [];
  editingId?: number;
  loading = true;
  saving = false;
  serverError = '';
  successMessage = '';
  form = this.fb.nonNullable.group({
    company_name: ['', Validators.required],
    job_title: ['', Validators.required],
    employment_type: [''],
    start_date: [''],
    end_date: [''],
    currently_working: [false],
    description: ['']
  });

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.service.list(this.resumeId).subscribe({
      next: (items) => { this.items = items; this.loading = false; },
      error: () => { this.serverError = 'Experience entries could not be loaded.'; this.loading = false; }
    });
  }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.serverError = '';
    this.successMessage = '';
    const request = this.editingId ? this.service.update(this.editingId, this.form.getRawValue()) : this.service.create(this.resumeId, this.form.getRawValue());
    request.subscribe({
      next: () => { this.successMessage = 'Experience saved successfully.'; this.saving = false; this.resetForm(); this.load(); },
      error: () => { this.serverError = 'Experience could not be saved.'; this.saving = false; }
    });
  }
  edit(item: Experience): void {
    this.editingId = item.id;
    this.form.patchValue({
      company_name: item.company_name,
      job_title: item.job_title,
      employment_type: item.employment_type ?? '',
      start_date: item.start_date ?? '',
      end_date: item.end_date ?? '',
      currently_working: item.currently_working,
      description: item.description ?? ''
    });
  }
  delete(id: number): void {
    if (!confirm('Delete this experience entry?')) { return; }
    this.service.delete(id).subscribe(() => this.load());
  }
  resetForm(): void { this.editingId = undefined; this.form.reset({ company_name: '', job_title: '', employment_type: '', start_date: '', end_date: '', currently_working: false, description: '' }); }
}
