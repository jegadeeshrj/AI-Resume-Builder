import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Resume } from '../../../shared/models/resume.model';
import { ResumeService } from '../services/resume.service';

@Component({
  selector: 'app-resume-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <main class="page">
      <section class="page-hero">
        <div>
          <p class="eyebrow">Resume Library</p>
          <h1>My Resumes</h1>
          <p class="muted">Create, edit, and review every resume profile attached to your account.</p>
        </div>
        <a class="button button-primary" routerLink="/resumes/create">Create New Resume</a>
      </section>

      @if (loading) {
        <section class="surface-panel">
          <div class="loading-row"><span class="spinner"></span><span>Loading resumes...</span></div>
        </section>
      } @else if (resumes.length) {
        <section class="resume-card-grid">
          @for (resume of resumes; track resume.id) {
            <article class="resume-card">
              <div class="resume-card-main">
                <span class="status-pill">Active</span>
                <h2>{{ resume.resume_title }}</h2>
                <p class="muted clamp">{{ resume.professional_summary || 'No summary added yet.' }}</p>
              </div>
              <div class="resume-meta">
                <span>Created: {{ resume.created_at | date:'mediumDate' }}</span>
                <span>Updated: {{ resume.updated_at | date:'mediumDate' }}</span>
              </div>
              <div class="actions card-actions">
                <a class="button button-outline" [routerLink]="['/resumes', resume.id]">View</a>
                <a class="button button-outline" [routerLink]="['/resumes', resume.id, 'personal-details']">Edit</a>
                <button class="button button-danger" type="button" (click)="deleteResume(resume.id)">Delete</button>
              </div>
            </article>
          }
        </section>
      } @else {
        <section class="empty-state">
          <h2>No resumes yet</h2>
          <p class="muted">Create your first resume profile to start adding details.</p>
          <a class="button button-primary" routerLink="/resumes/create">Create New Resume</a>
        </section>
      }
    </main>
  `
})
export class ResumeListComponent implements OnInit {
  private resumeService = inject(ResumeService);

  loading = true;
  resumes: Resume[] = [];

  ngOnInit(): void {
    this.loadResumes();
  }

  loadResumes(): void {
    this.resumeService.list().subscribe({
      next: (resumes) => {
        this.resumes = resumes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteResume(id: number): void {
    if (!confirm('Delete this resume? This action cannot be undone.')) {
      return;
    }
    this.resumeService.delete(id).subscribe(() => this.loadResumes());
  }
}
