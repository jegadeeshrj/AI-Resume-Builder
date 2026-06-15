import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Education } from '../../../shared/models/resume.model';
import { EducationService } from '../services/education.service';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="wizard-bar"><strong>Step 2 of 7</strong><span class="muted">Education</span></section>
      <section class="wizard-steps">
        <span>1. Personal Details</span><span class="active">2. Education</span><span>3. Experience</span><span>4. Skills</span><span>5. Projects</span><span>6. Certifications</span><span>7. Review</span>
      </section>
      <section class="form-panel">
        <div class="section-heading">
          <div><h1>Education</h1><p class="muted">Add degrees, institutions, and academic highlights.</p></div>
        </div>
        @if (successMessage) { <div class="alert alert-success">{{ successMessage }}</div> }
        @if (serverError) { <div class="alert alert-danger">{{ serverError }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid">
            <div class="form-row"><label>Degree</label><input formControlName="degree" placeholder="B.Tech">@if (form.controls.degree.touched && form.controls.degree.invalid) { <div class="error">Degree is required.</div> }</div>
            <div class="form-row"><label>Institution</label><input formControlName="institution" placeholder="Example University">@if (form.controls.institution.touched && form.controls.institution.invalid) { <div class="error">Institution is required.</div> }</div>
            <div class="form-row"><label>Field of study</label><input formControlName="field_of_study" placeholder="Computer Science"></div>
            <div class="form-row"><label>Start year</label><input type="number" formControlName="start_year" placeholder="2018"></div>
            <div class="form-row"><label>End year</label><input type="number" formControlName="end_year" placeholder="2022"></div>
            <div class="form-row"><label>Grade</label><input formControlName="grade" placeholder="8.6 CGPA"></div>
          </div>
          <div class="form-row"><label>Description</label><textarea formControlName="description" placeholder="Relevant coursework, honors, or academic achievements."></textarea></div>
          <div class="actions form-actions">
            <button class="button button-primary" type="submit" [disabled]="form.invalid || saving">
              @if (saving) { <span class="spinner light"></span> }
              {{ saving ? 'Saving...' : editingId ? 'Update Education' : 'Add Education' }}
            </button>
            <button class="button button-outline" type="button" (click)="resetForm()">Clear</button>
            <a class="button button-outline" [routerLink]="['/resumes', resumeId, 'personal-details']">Previous</a>
            <a class="button button-outline" [routerLink]="['/resumes', resumeId, 'experience']">Next</a>
          </div>
        </form>
      </section>
      <section class="section-heading list-heading"><h2>Saved Education</h2></section>
      @if (loading) {
        <section class="surface-panel"><div class="loading-row"><span class="spinner"></span><span>Loading education...</span></div></section>
      } @else {
        <section class="grid-list">@for (item of items; track item.id) { <article class="item-card"><h2>{{ item.degree }}</h2><p>{{ item.institution }}</p><p class="muted">{{ item.field_of_study || 'Field not set' }}</p><p class="muted">{{ item.start_year || '' }} - {{ item.end_year || '' }}</p><div class="actions card-actions"><button class="button button-outline" type="button" (click)="edit(item)">Edit</button><button class="button button-danger" type="button" (click)="delete(item.id)">Delete</button></div></article> } @empty { <article class="empty-state compact"><p class="muted">No education entries added yet.</p></article> }</section>
      }
    </main>
  `
})
export class EducationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(EducationService);

  resumeId = Number(this.route.snapshot.paramMap.get('id'));
  items: Education[] = [];
  editingId?: number;
  loading = true;
  saving = false;
  serverError = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    degree: ['', Validators.required],
    institution: ['', Validators.required],
    field_of_study: [''],
    start_year: this.fb.control<number | null>(null),
    end_year: this.fb.control<number | null>(null),
    grade: [''],
    description: ['']
  });

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.service.list(this.resumeId).subscribe({
      next: (items) => { this.items = items; this.loading = false; },
      error: () => { this.serverError = 'Education entries could not be loaded.'; this.loading = false; }
    });
  }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.serverError = '';
    this.successMessage = '';
    const request = this.editingId ? this.service.update(this.editingId, this.form.getRawValue()) : this.service.create(this.resumeId, this.form.getRawValue());
    request.subscribe({
      next: () => { this.successMessage = 'Education saved successfully.'; this.saving = false; this.resetForm(); this.load(); },
      error: () => { this.serverError = 'Education could not be saved.'; this.saving = false; }
    });
  }
  edit(item: Education): void {
    this.editingId = item.id;
    this.form.patchValue({
      degree: item.degree,
      institution: item.institution,
      field_of_study: item.field_of_study ?? '',
      start_year: item.start_year ?? null,
      end_year: item.end_year ?? null,
      grade: item.grade ?? '',
      description: item.description ?? ''
    });
  }
  delete(id: number): void {
    if (!confirm('Delete this education entry?')) { return; }
    this.service.delete(id).subscribe(() => this.load());
  }
  resetForm(): void { this.editingId = undefined; this.form.reset({ degree: '', institution: '', field_of_study: '', start_year: null, end_year: null, grade: '', description: '' }); }
}
