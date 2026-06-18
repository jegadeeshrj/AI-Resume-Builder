import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ResumeService } from '../services/resume.service';

@Component({
  selector: 'app-resume-generate',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  template: `
    <main class="page">
      <section class="page-hero compact">
        <div>
          <p class="eyebrow">AI Resume Generation</p>
          <h1>Generate Professional Resume</h1>
          <p class="muted">Use your saved resume details to create a polished, ATS-friendly resume preview.</p>
        </div>
        <a class="button button-outline" [routerLink]="['/resumes', resumeId]">Back to Resume</a>
      </section>

      @if (successMessage) {
        <div class="alert alert-success">{{ successMessage }}</div>
      }
      @if (serverError) {
        <div class="alert alert-danger">{{ serverError }}</div>
      }

      <section class="surface-panel generate-actions-panel">
        <button class="button button-primary" type="button" (click)="generate()" [disabled]="generating">
          @if (generating) { <span class="spinner light"></span> }
          {{ generating ? 'Generating...' : 'Generate AI Resume' }}
        </button>
        <button class="button button-outline" type="button" (click)="downloadPdf()" [disabled]="!generatedContent || downloading">
          Download PDF
        </button>
        <button class="button button-outline" type="button" (click)="downloadWord()" [disabled]="!generatedContent || downloading">
          Download Word
        </button>
      </section>

      @if (generatedContent) {
        <section class="resume-preview generated-preview">
          <header class="resume-preview-header">
            <h1>{{ generatedContent['full_name'] || 'Generated Resume' }}</h1>
            <p>{{ generatedContent['email'] || '' }} {{ generatedContent['phone'] ? '| ' + generatedContent['phone'] : '' }}</p>
          </header>

          <section class="resume-section">
            <h2>Professional Summary</h2>
            <p>{{ generatedContent['professional_summary'] || 'Not provided' }}</p>
          </section>

          <section class="resume-section">
            <h2>Skills</h2>
            <div class="skill-cloud">
              @for (skill of asArray(generatedContent['skills']); track skill) {
                <span class="pill">{{ formatValue(skill) }}</span>
              } @empty {
                <p class="muted">No skills generated.</p>
              }
            </div>
          </section>

          <section class="resume-section">
            <h2>Experience</h2>
            @for (item of asArray(generatedContent['experience']); track item) {
              <div class="resume-entry">
                <div>
                  <strong>{{ item?.job_title || 'Role' }}</strong>
                  <p>{{ item?.company_name || '' }}</p>
                </div>
                <span class="muted">{{ item?.duration || '' }}</span>
              </div>
              @for (point of asArray(item?.responsibilities); track point) {
                <p>&bull; {{ point }}</p>
              }
            } @empty {
              <p class="muted">No experience generated.</p>
            }
          </section>

          <section class="resume-section">
            <h2>Education</h2>
            @for (item of asArray(generatedContent['education']); track item) { <p>{{ formatValue(item) }}</p> } @empty { <p class="muted">No education generated.</p> }
          </section>

          <section class="resume-section">
            <h2>Projects</h2>
            @for (item of asArray(generatedContent['projects']); track item) { <p>{{ formatValue(item) }}</p> } @empty { <p class="muted">No projects generated.</p> }
          </section>

          <section class="resume-section">
            <h2>Certifications</h2>
            @for (item of asArray(generatedContent['certifications']); track item) { <p>{{ formatValue(item) }}</p> } @empty { <p class="muted">No certifications generated.</p> }
          </section>
        </section>

        <details class="surface-panel raw-json-panel">
          <summary>View generated JSON</summary>
          <pre>{{ generatedContent | json }}</pre>
        </details>
      }
    </main>
  `
})
export class ResumeGenerateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private resumeService = inject(ResumeService);

  resumeId = Number(this.route.snapshot.paramMap.get('id'));
  generatedContent?: Record<string, any>;
  generating = false;
  downloading = false;
  successMessage = '';
  serverError = '';

  ngOnInit(): void {
    if (!this.resumeId) {
      this.serverError = 'Resume not found.';
    }
  }

  asArray(value: unknown): any[] {
    return Array.isArray(value) ? value : [];
  }

  formatValue(value: unknown): string {
    if (value && typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .filter(([, itemValue]) => Boolean(itemValue))
        .map(([key, itemValue]) => `${key.replace(/_/g, ' ')}: ${itemValue}`)
        .join(' | ');
    }
    return String(value ?? '');
  }

  generate(): void {
    this.generating = true;
    this.successMessage = '';
    this.serverError = '';
    this.resumeService.generateResume(this.resumeId).subscribe({
      next: (response) => {
        this.generatedContent = response.generated_content;
        this.successMessage = 'AI resume generated successfully.';
        this.generating = false;
      },
      error: (error) => {
        this.serverError = error.error?.detail ?? 'Resume generation failed.';
        this.generating = false;
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
    this.downloading = true;
    this.serverError = '';
    const request = type === 'pdf'
      ? this.resumeService.downloadResumePdf(this.resumeId)
      : this.resumeService.downloadResumeWord(this.resumeId);

    request.subscribe({
      next: (blob) => {
        const extension = type === 'pdf' ? 'pdf' : 'docx';
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume_${this.resumeId}.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        this.downloading = false;
      },
      error: (error) => {
        this.setBlobError(error, 'Download failed.');
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
          this.serverError = parsed.detail ?? fallback;
        } catch {
          this.serverError = fallback;
        }
      };
      reader.readAsText(error.error);
      return;
    }
    this.serverError = error.error?.detail ?? fallback;
  }
}
