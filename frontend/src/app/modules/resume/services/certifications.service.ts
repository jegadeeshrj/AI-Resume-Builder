import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Certification } from '../../../shared/models/resume.model';
import { cleanPayload } from './payload';

@Injectable({ providedIn: 'root' })
export class CertificationsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  list(resumeId: number): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${this.apiUrl}/resumes/${resumeId}/certifications`);
  }

  create(resumeId: number, payload: Partial<Certification>): Observable<Certification> {
    return this.http.post<Certification>(`${this.apiUrl}/resumes/${resumeId}/certifications`, cleanPayload(payload));
  }

  update(id: number, payload: Partial<Certification>): Observable<Certification> {
    return this.http.put<Certification>(`${this.apiUrl}/certifications/${id}`, cleanPayload(payload));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/certifications/${id}`);
  }
}
