import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Experience } from '../../../shared/models/resume.model';
import { cleanPayload } from './payload';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  list(resumeId: number): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.apiUrl}/resumes/${resumeId}/experience`);
  }

  create(resumeId: number, payload: Partial<Experience>): Observable<Experience> {
    return this.http.post<Experience>(`${this.apiUrl}/resumes/${resumeId}/experience`, cleanPayload(payload));
  }

  update(id: number, payload: Partial<Experience>): Observable<Experience> {
    return this.http.put<Experience>(`${this.apiUrl}/experience/${id}`, cleanPayload(payload));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/experience/${id}`);
  }
}
