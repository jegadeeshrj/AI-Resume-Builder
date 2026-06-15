import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ResumeDetail } from '../../../shared/models/resume.model';
import { ResumeService } from '../services/resume.service';

@Component({
  selector: 'app-resume-view',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="page">
      <section class="wizard-steps">
        <span>1. Personal Details</span><span>2. Education</span><span>3. Experience</span><span>4. Skills</span><span>5. Projects</span><span>6. Certifications</span><span class="active">7. Review</span>
      </section>
      @if (resume) {
        <section class="page-header resume-actions-header">
          <a class="button button-outline" routerLink="/resumes">Back to Resumes</a>
          <a class="button button-primary" [routerLink]="['/resumes', resume.id, 'personal-details']">Edit</a>
        </section>

        <section class="resume-preview">
          <header class="resume-preview-header">
            @if (resume.personal_details) {
              <h1>{{ resume.personal_details.first_name }} {{ resume.personal_details.last_name }}</h1>
              <p>{{ resume.personal_details.email }} | {{ resume.personal_details.phone }}</p>
              <p class="muted">
                {{ resume.personal_details.city || '' }}
                {{ resume.personal_details.state ? ', ' + resume.personal_details.state : '' }}
                {{ resume.personal_details.country ? ', ' + resume.personal_details.country : '' }}
              </p>
              <div class="resume-links">
                @if (resume.personal_details.linkedin_url) { <span>{{ resume.personal_details.linkedin_url }}</span> }
                @if (resume.personal_details.github_url) { <span>{{ resume.personal_details.github_url }}</span> }
                @if (resume.personal_details.portfolio_url) { <span>{{ resume.personal_details.portfolio_url }}</span> }
              </div>
            } @else {
              <h1>{{ resume.resume_title }}</h1>
              <p class="muted">Personal details not added.</p>
            }
          </header>

          <section class="resume-section">
            <h2>Professional Summary</h2>
            <p>{{ resume.professional_summary || 'No professional summary added.' }}</p>
          </section>

          <section class="resume-section">
            <h2>Education</h2>
            @for (item of resume.education; track item.id) {
              <div class="resume-entry">
                <div><strong>{{ item.degree }}</strong><p>{{ item.institution }}</p></div>
                <span class="muted">{{ item.start_year || '' }} - {{ item.end_year || '' }}</span>
              </div>
              @if (item.field_of_study) { <p class="muted">{{ item.field_of_study }}</p> }
              @if (item.description) { <p>{{ item.description }}</p> }
            } @empty { <p class="muted">Not added.</p> }
          </section>

          <section class="resume-section">
            <h2>Experience</h2>
            @for (item of resume.experience; track item.id) {
              <div class="resume-entry">
                <div><strong>{{ item.job_title }}</strong><p>{{ item.company_name }}</p></div>
                <span class="muted">{{ item.start_date || '' }} - {{ item.currently_working ? 'Present' : item.end_date || '' }}</span>
              </div>
              @if (item.description) { <p>{{ item.description }}</p> }
            } @empty { <p class="muted">Not added.</p> }
          </section>

          <section class="resume-section">
            <h2>Skills</h2>
            <div class="skill-cloud">@for (item of resume.skills; track item.id) { <span class="pill">{{ item.skill_name }}{{ item.skill_level ? ' - ' + item.skill_level : '' }}</span> } @empty { <p class="muted">Not added.</p> }</div>
          </section>

          <section class="resume-section">
            <h2>Projects</h2>
            @for (item of resume.projects; track item.id) {
              <div class="resume-entry"><strong>{{ item.project_name }}</strong><span class="muted">{{ item.technologies || '' }}</span></div>
              @if (item.project_url) { <p class="muted">{{ item.project_url }}</p> }
              @if (item.description) { <p>{{ item.description }}</p> }
            } @empty { <p class="muted">Not added.</p> }
          </section>

          <section class="resume-section">
            <h2>Certifications</h2>
            @for (item of resume.certifications; track item.id) {
              <div class="resume-entry"><strong>{{ item.certification_name }}</strong><span class="muted">{{ item.issue_date || '' }}</span></div>
              <p>{{ item.issuing_organization }}</p>
            } @empty { <p class="muted">Not added.</p> }
          </section>
        </section>
      } @else if (serverError) {
        <section class="surface-panel"><div class="alert alert-danger">{{ serverError }}</div></section>
      } @else {
        <section class="surface-panel"><div class="loading-row"><span class="spinner"></span><span>Loading resume...</span></div></section>
      }
    </main>
  `
})
export class ResumeViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private resumeService = inject(ResumeService);

  resume?: ResumeDetail;
  serverError = '';

  ngOnInit(): void {
    const resumeId = Number(this.route.snapshot.paramMap.get('id'));
    this.resumeService.get(resumeId).subscribe({
      next: (resume) => {
        this.resume = resume;
      },
      error: () => {
        this.serverError = 'Resume could not be loaded.';
      }
    });
  }
}
