import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Education } from '../../../shared/models/resume.model';
import { cleanPayload } from './payload';

@Injectable({ providedIn: 'root' })
export class EducationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  list(resumeId: number): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.apiUrl}/resumes/${resumeId}/education`);
  }

  create(resumeId: number, payload: Partial<Education>): Observable<Education> {
    return this.http.post<Education>(`${this.apiUrl}/resumes/${resumeId}/education`, cleanPayload(payload));
  }

  update(id: number, payload: Partial<Education>): Observable<Education> {
    return this.http.put<Education>(`${this.apiUrl}/education/${id}`, cleanPayload(payload));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/education/${id}`);
  }
}
