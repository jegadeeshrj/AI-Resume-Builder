import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Skill } from '../../../shared/models/resume.model';
import { SkillsService } from '../services/skills.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="wizard-bar"><strong>Step 4 of 7</strong><span class="muted">Skills</span></section>
      <section class="wizard-steps">
        <span>1. Personal Details</span><span>2. Education</span><span>3. Experience</span><span class="active">4. Skills</span><span>5. Projects</span><span>6. Certifications</span><span>7. Review</span>
      </section>
      <section class="form-panel">
        <div class="section-heading"><div><h1>Skills</h1><p class="muted">Highlight technical and professional strengths.</p></div></div>
        @if (successMessage) { <div class="alert alert-success">{{ successMessage }}</div> }
        @if (serverError) { <div class="alert alert-danger">{{ serverError }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid">
            <div class="form-row"><label>Skill name</label><input formControlName="skill_name" placeholder="Angular">@if (form.controls.skill_name.touched && form.controls.skill_name.invalid) { <div class="error">Skill name is required.</div> }</div>
            <div class="form-row"><label>Skill level</label><input formControlName="skill_level" placeholder="Advanced"></div>
          </div>
          <div class="actions form-actions"><button class="button button-primary" [disabled]="form.invalid || saving">@if (saving) { <span class="spinner light"></span> } {{ saving ? 'Saving...' : editingId ? 'Update Skill' : 'Add Skill' }}</button><button class="button button-outline" type="button" (click)="resetForm()">Clear</button><a class="button button-outline" [routerLink]="['/resumes', resumeId, 'experience']">Previous</a><a class="button button-outline" [routerLink]="['/resumes', resumeId, 'projects']">Next</a></div>
        </form>
      </section>
      <section class="section-heading list-heading"><h2>Saved Skills</h2></section>
      @if (loading) {
        <section class="surface-panel"><div class="loading-row"><span class="spinner"></span><span>Loading skills...</span></div></section>
      } @else {
        <section class="grid-list">@for (item of items; track item.id) { <article class="item-card"><h2>{{ item.skill_name }}</h2><p class="muted">{{ item.skill_level || 'Level not set' }}</p><div class="actions card-actions"><button class="button button-outline" type="button" (click)="edit(item)">Edit</button><button class="button button-danger" type="button" (click)="delete(item.id)">Delete</button></div></article> } @empty { <article class="empty-state compact"><p class="muted">No skills added yet.</p></article> }</section>
      }
    </main>
  `
})
export class SkillsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(SkillsService);

  resumeId = Number(this.route.snapshot.paramMap.get('id'));
  items: Skill[] = [];
  editingId?: number;
  loading = true;
  saving = false;
  serverError = '';
  successMessage = '';
  form = this.fb.nonNullable.group({
    skill_name: ['', Validators.required],
    skill_level: ['']
  });

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.service.list(this.resumeId).subscribe({
      next: (items) => { this.items = items; this.loading = false; },
      error: () => { this.serverError = 'Skills could not be loaded.'; this.loading = false; }
    });
  }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.serverError = '';
    this.successMessage = '';
    const request = this.editingId ? this.service.update(this.editingId, this.form.getRawValue()) : this.service.create(this.resumeId, this.form.getRawValue());
    request.subscribe({
      next: () => { this.successMessage = 'Skill saved successfully.'; this.saving = false; this.resetForm(); this.load(); },
      error: () => { this.serverError = 'Skill could not be saved.'; this.saving = false; }
    });
  }
  edit(item: Skill): void { this.editingId = item.id; this.form.patchValue({ skill_name: item.skill_name, skill_level: item.skill_level ?? '' }); }
  delete(id: number): void {
    if (!confirm('Delete this skill?')) { return; }
    this.service.delete(id).subscribe(() => this.load());
  }
  resetForm(): void { this.editingId = undefined; this.form.reset({ skill_name: '', skill_level: '' }); }
}
