import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PersonalDetails, Resume, ResumeDetail } from '../../../shared/models/resume.model';
import { cleanPayload } from './payload';

export interface GeneratedResumeResponse {
  resume_id: number;
  generated_content: Record<string, unknown>;
}

export interface GeneratedResumeStatusResponse {
  resume_id: number;
  has_generated_resume: boolean;
}

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/resumes`;
  private generationUrl = `${environment.apiUrl}/resume-generation`;

  list(): Observable<Resume[]> {
    return this.http.get<Resume[]>(this.apiUrl);
  }

  create(payload: Partial<Resume>): Observable<Resume> {
    return this.http.post<Resume>(this.apiUrl, cleanPayload(payload));
  }

  get(id: number): Observable<ResumeDetail> {
    return this.http.get<ResumeDetail>(`${this.apiUrl}/${id}`);
  }

  update(id: number, payload: Partial<Resume>): Observable<Resume> {
    return this.http.put<Resume>(`${this.apiUrl}/${id}`, cleanPayload(payload));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createPersonalDetails(resumeId: number, payload: Partial<PersonalDetails>): Observable<PersonalDetails> {
    return this.http.post<PersonalDetails>(`${this.apiUrl}/${resumeId}/personal-details`, cleanPayload(payload));
  }

  getPersonalDetails(resumeId: number): Observable<PersonalDetails> {
    return this.http.get<PersonalDetails>(`${this.apiUrl}/${resumeId}/personal-details`);
  }

  updatePersonalDetails(resumeId: number, payload: Partial<PersonalDetails>): Observable<PersonalDetails> {
    return this.http.put<PersonalDetails>(`${this.apiUrl}/${resumeId}/personal-details`, cleanPayload(payload));
  }

  generateResume(resumeId: number): Observable<GeneratedResumeResponse> {
    return this.http.post<GeneratedResumeResponse>(`${this.generationUrl}/${resumeId}/generate`, {});
  }

  getGeneratedResumeStatus(resumeId: number): Observable<GeneratedResumeStatusResponse> {
    return this.http.get<GeneratedResumeStatusResponse>(`${this.generationUrl}/${resumeId}/status`);
  }

  downloadResumePdf(resumeId: number): Observable<Blob> {
    return this.http.get(`${this.generationUrl}/${resumeId}/download/pdf`, { responseType: 'blob' });
  }

  downloadResumeWord(resumeId: number): Observable<Blob> {
    return this.http.get(`${this.generationUrl}/${resumeId}/download/word`, { responseType: 'blob' });
  }
}
