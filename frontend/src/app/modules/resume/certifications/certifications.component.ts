import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Certification } from '../../../shared/models/resume.model';
import { CertificationsService } from '../services/certifications.service';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="wizard-bar"><strong>Step 6 of 7</strong><span class="muted">Certifications</span></section>
      <section class="wizard-steps">
        <span>1. Personal Details</span><span>2. Education</span><span>3. Experience</span><span>4. Skills</span><span>5. Projects</span><span class="active">6. Certifications</span><span>7. Review</span>
      </section>
      <section class="form-panel">
        <div class="section-heading"><div><h1>Certifications</h1><p class="muted">Add credentials, issuing organizations, and verification links.</p></div></div>
        @if (successMessage) { <div class="alert alert-success">{{ successMessage }}</div> }
        @if (serverError) { <div class="alert alert-danger">{{ serverError }}</div> }
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid">
            <div class="form-row"><label>Certification name</label><input formControlName="certification_name" placeholder="AWS Cloud Practitioner">@if (form.controls.certification_name.touched && form.controls.certification_name.invalid) { <div class="error">Certification name is required.</div> }</div>
            <div class="form-row"><label>Issuing organization</label><input formControlName="issuing_organization" placeholder="Amazon Web Services">@if (form.controls.issuing_organization.touched && form.controls.issuing_organization.invalid) { <div class="error">Issuing organization is required.</div> }</div>
            <div class="form-row"><label>Issue date</label><input type="date" formControlName="issue_date"></div>
            <div class="form-row"><label>Expiration date</label><input type="date" formControlName="expiration_date"></div>
            <div class="form-row"><label>Credential ID</label><input formControlName="credential_id" placeholder="ABC-12345"></div>
            <div class="form-row"><label>Credential URL</label><input type="url" formControlName="credential_url" placeholder="https://example.com/cert"></div>
          </div>
          @if (form.controls.credential_url.touched && form.controls.credential_url.invalid) { <div class="error">Enter a valid URL.</div> }
          <div class="actions form-actions"><button class="button button-primary" [disabled]="form.invalid || saving">@if (saving) { <span class="spinner light"></span> } {{ saving ? 'Saving...' : editingId ? 'Update Certification' : 'Add Certification' }}</button><button class="button button-outline" type="button" (click)="resetForm()">Clear</button><a class="button button-outline" [routerLink]="['/resumes', resumeId, 'projects']">Previous</a><a class="button button-outline" [routerLink]="['/resumes', resumeId]">Review</a></div>
        </form>
      </section>
      <section class="section-heading list-heading"><h2>Saved Certifications</h2></section>
      @if (loading) {
        <section class="surface-panel"><div class="loading-row"><span class="spinner"></span><span>Loading certifications...</span></div></section>
      } @else {
        <section class="grid-list">@for (item of items; track item.id) { <article class="item-card"><h2>{{ item.certification_name }}</h2><p class="muted">{{ item.issuing_organization }}</p><p class="muted">{{ item.issue_date || 'Issue date not set' }}</p><div class="actions card-actions"><button class="button button-outline" type="button" (click)="edit(item)">Edit</button><button class="button button-danger" type="button" (click)="delete(item.id)">Delete</button></div></article> } @empty { <article class="empty-state compact"><p class="muted">No certifications added yet.</p></article> }</section>
      }
    </main>
  `
})
export class CertificationsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(CertificationsService);
  private urlPattern = /^https?:\/\/.+/;

  resumeId = Number(this.route.snapshot.paramMap.get('id'));
  items: Certification[] = [];
  editingId?: number;
  loading = true;
  saving = false;
  serverError = '';
  successMessage = '';
  form = this.fb.nonNullable.group({
    certification_name: ['', Validators.required],
    issuing_organization: ['', Validators.required],
    issue_date: [''],
    expiration_date: [''],
    credential_id: [''],
    credential_url: ['', Validators.pattern(this.urlPattern)]
  });

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.service.list(this.resumeId).subscribe({
      next: (items) => { this.items = items; this.loading = false; },
      error: () => { this.serverError = 'Certifications could not be loaded.'; this.loading = false; }
    });
  }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.serverError = '';
    this.successMessage = '';
    const request = this.editingId ? this.service.update(this.editingId, this.form.getRawValue()) : this.service.create(this.resumeId, this.form.getRawValue());
    request.subscribe({
      next: () => { this.successMessage = 'Certification saved successfully.'; this.saving = false; this.resetForm(); this.load(); },
      error: () => { this.serverError = 'Certification could not be saved.'; this.saving = false; }
    });
  }
  edit(item: Certification): void { this.editingId = item.id; this.form.patchValue({ certification_name: item.certification_name, issuing_organization: item.issuing_organization, issue_date: item.issue_date ?? '', expiration_date: item.expiration_date ?? '', credential_id: item.credential_id ?? '', credential_url: item.credential_url ?? '' }); }
  delete(id: number): void {
    if (!confirm('Delete this certification?')) { return; }
    this.service.delete(id).subscribe(() => this.load());
  }
  resetForm(): void { this.editingId = undefined; this.form.reset({ certification_name: '', issuing_organization: '', issue_date: '', expiration_date: '', credential_id: '', credential_url: '' }); }
}
