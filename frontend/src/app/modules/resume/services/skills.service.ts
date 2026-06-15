import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Skill } from '../../../shared/models/resume.model';
import { cleanPayload } from './payload';

@Injectable({ providedIn: 'root' })
export class SkillsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  list(resumeId: number): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/resumes/${resumeId}/skills`);
  }

  create(resumeId: number, payload: Partial<Skill>): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiUrl}/resumes/${resumeId}/skills`, cleanPayload(payload));
  }

  update(id: number, payload: Partial<Skill>): Observable<Skill> {
    return this.http.put<Skill>(`${this.apiUrl}/skills/${id}`, cleanPayload(payload));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/skills/${id}`);
  }
}
