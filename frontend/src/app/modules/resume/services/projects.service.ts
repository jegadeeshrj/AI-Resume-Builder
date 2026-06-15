import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Project } from '../../../shared/models/resume.model';
import { cleanPayload } from './payload';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  list(resumeId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/resumes/${resumeId}/projects`);
  }

  create(resumeId: number, payload: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/resumes/${resumeId}/projects`, cleanPayload(payload));
  }

  update(id: number, payload: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, cleanPayload(payload));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
  }
}
