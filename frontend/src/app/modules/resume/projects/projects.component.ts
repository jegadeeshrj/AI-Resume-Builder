import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Project } from '../../../shared/models/resume.model';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="wizard-bar"><strong>Step 5 of 7</strong><span class="muted">Projects</span></section>
      <section class="wizard-steps">
        <span>1. Personal Details</span><span>2. Education</span><span>3. Experience</span><span>4. Skills</span><span class="active">5. Projects</span><span>6. Certifications</span><span>7. Review</span>
      </section>
      <section class="form-panel">
        <div class="section-heading"><div><h1>Projects</h1><p class="muted">Showcase relevant work, links, and technologies.</p></div></div>
        @if (successMessage) { <div class="alert alert-success">{{ successMessage }}</div> }
        @if (serverError) { <div class="alert alert-danger">{{ serverError }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid">
            <div class="form-row"><label>Project name</label><input formControlName="project_name" placeholder="AI Resume Builder">@if (form.controls.project_name.touched && form.controls.project_name.invalid) { <div class="error">Project name is required.</div> }</div>
            <div class="form-row"><label>Technologies</label><input formControlName="technologies" placeholder="Angular, FastAPI, PostgreSQL"></div>
            <div class="form-row"><label>Project URL</label><input type="url" formControlName="project_url" placeholder="https://example.com"></div>
          </div>
          <div class="form-row"><label>Description</label><textarea formControlName="description" placeholder="Briefly describe the project, your role, and outcomes."></textarea></div>
          @if (form.controls.project_url.touched && form.controls.project_url.invalid) { <div class="error">Enter a valid URL.</div> }
          <div class="actions form-actions"><button class="button button-primary" [disabled]="form.invalid || saving">@if (saving) { <span class="spinner light"></span> } {{ saving ? 'Saving...' : editingId ? 'Update Project' : 'Add Project' }}</button><button class="button button-outline" type="button" (click)="resetForm()">Clear</button><a class="button button-outline" [routerLink]="['/resumes', resumeId, 'skills']">Previous</a><a class="button button-outline" [routerLink]="['/resumes', resumeId, 'certifications']">Next</a></div>
        </form>
      </section>
      <section class="section-heading list-heading"><h2>Saved Projects</h2></section>
      @if (loading) {
        <section class="surface-panel"><div class="loading-row"><span class="spinner"></span><span>Loading projects...</span></div></section>
      } @else {
        <section class="grid-list">@for (item of items; track item.id) { <article class="item-card"><h2>{{ item.project_name }}</h2><p class="muted">{{ item.technologies || 'No technologies listed' }}</p><p>{{ item.description || 'No description added.' }}</p><div class="actions card-actions"><button class="button button-outline" type="button" (click)="edit(item)">Edit</button><button class="button button-danger" type="button" (click)="delete(item.id)">Delete</button></div></article> } @empty { <article class="empty-state compact"><p class="muted">No projects added yet.</p></article> }</section>
      }
    </main>
  `
})
export class ProjectsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(ProjectsService);
  private urlPattern = /^https?:\/\/.+/;

  resumeId = Number(this.route.snapshot.paramMap.get('id'));
  items: Project[] = [];
  editingId?: number;
  loading = true;
  saving = false;
  serverError = '';
  successMessage = '';
  form = this.fb.nonNullable.group({
    project_name: ['', Validators.required],
    technologies: [''],
    project_url: ['', Validators.pattern(this.urlPattern)],
    description: ['']
  });

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.service.list(this.resumeId).subscribe({
      next: (items) => { this.items = items; this.loading = false; },
      error: () => { this.serverError = 'Projects could not be loaded.'; this.loading = false; }
    });
  }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.serverError = '';
    this.successMessage = '';
    const request = this.editingId ? this.service.update(this.editingId, this.form.getRawValue()) : this.service.create(this.resumeId, this.form.getRawValue());
    request.subscribe({
      next: () => { this.successMessage = 'Project saved successfully.'; this.saving = false; this.resetForm(); this.load(); },
      error: () => { this.serverError = 'Project could not be saved.'; this.saving = false; }
    });
  }
  edit(item: Project): void { this.editingId = item.id; this.form.patchValue({ project_name: item.project_name, technologies: item.technologies ?? '', project_url: item.project_url ?? '', description: item.description ?? '' }); }
  delete(id: number): void {
    if (!confirm('Delete this project?')) { return; }
    this.service.delete(id).subscribe(() => this.load());
  }
  resetForm(): void { this.editingId = undefined; this.form.reset({ project_name: '', technologies: '', project_url: '', description: '' }); }
}
