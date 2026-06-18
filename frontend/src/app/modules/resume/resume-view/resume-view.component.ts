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
          <div class="actions">
            <a class="button button-primary" [routerLink]="['/resumes', resume.id, 'generate']">Generate AI Resume</a>
            <button class="button button-outline" type="button" (click)="downloadPdf()" [disabled]="!hasGeneratedResume || checkingGeneratedResume || downloading">Download PDF</button>
            <button class="button button-outline" type="button" (click)="downloadWord()" [disabled]="!hasGeneratedResume || checkingGeneratedResume || downloading">Download Word</button>
            <a class="button button-outline" [routerLink]="['/resumes', resume.id, 'personal-details']">Edit</a>
          </div>
        </section>

        @if (!checkingGeneratedResume && !hasGeneratedResume) {
          <section class="surface-panel"><div class="alert alert-info">Generate the AI resume to enable PDF and Word downloads.</div></section>
        }

        @if (downloadError) {
          <section class="surface-panel"><div class="alert alert-danger">{{ downloadError }}</div></section>
        }

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
  downloadError = '';
  downloading = false;
  checkingGeneratedResume = true;
  hasGeneratedResume = false;

  ngOnInit(): void {
    const resumeId = Number(this.route.snapshot.paramMap.get('id'));
    this.resumeService.get(resumeId).subscribe({
      next: (resume) => {
        this.resume = resume;
        this.loadGeneratedResumeStatus(resume.id);
      },
      error: () => {
        this.serverError = 'Resume could not be loaded.';
        this.checkingGeneratedResume = false;
      }
    });
  }

  downloadPdf(): void {
    this.download('pdf');
  }

  downloadWord(): void {
    this.download('word');
  }

  private download(type: 'pdf' | 'word'): void {
    if (!this.resume || !this.hasGeneratedResume) {
      return;
    }
    this.downloading = true;
    this.downloadError = '';
    const request = type === 'pdf'
      ? this.resumeService.downloadResumePdf(this.resume.id)
      : this.resumeService.downloadResumeWord(this.resume.id);

    request.subscribe({
      next: (blob) => {
        const extension = type === 'pdf' ? 'pdf' : 'docx';
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume_${this.resume?.id}.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        this.downloading = false;
      },
      error: (error) => {
        this.setBlobError(error, 'Download failed. Generate the AI resume first.');
        this.downloading = false;
      }
    });
  }

  private setBlobError(error: any, fallback: string): void {
    if (error.error instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          this.downloadError = parsed.detail ?? fallback;
        } catch {
          this.downloadError = fallback;
        }
      };
      reader.readAsText(error.error);
      return;
    }
    this.downloadError = error.error?.detail ?? fallback;
  }

  private loadGeneratedResumeStatus(resumeId: number): void {
    this.checkingGeneratedResume = true;
    this.resumeService.getGeneratedResumeStatus(resumeId).subscribe({
      next: (status) => {
        this.hasGeneratedResume = status.has_generated_resume;
        this.checkingGeneratedResume = false;
      },
      error: () => {
        this.hasGeneratedResume = false;
        this.checkingGeneratedResume = false;
      }
    });
  }
}
