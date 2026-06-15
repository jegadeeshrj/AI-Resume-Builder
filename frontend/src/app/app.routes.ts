import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './modules/auth/login/login.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { CertificationsComponent } from './modules/resume/certifications/certifications.component';
import { EducationComponent } from './modules/resume/education/education.component';
import { ExperienceComponent } from './modules/resume/experience/experience.component';
import { PersonalDetailsComponent } from './modules/resume/personal-details/personal-details.component';
import { ProjectsComponent } from './modules/resume/projects/projects.component';
import { ResumeCreateComponent } from './modules/resume/resume-create/resume-create.component';
import { ResumeListComponent } from './modules/resume/resume-list/resume-list.component';
import { ResumeViewComponent } from './modules/resume/resume-view/resume-view.component';
import { SkillsComponent } from './modules/resume/skills/skills.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'resumes', component: ResumeListComponent, canActivate: [authGuard] },
  { path: 'resumes/create', component: ResumeCreateComponent, canActivate: [authGuard] },
  { path: 'resumes/:id', component: ResumeViewComponent, canActivate: [authGuard] },
  { path: 'resumes/:id/personal-details', component: PersonalDetailsComponent, canActivate: [authGuard] },
  { path: 'resumes/:id/education', component: EducationComponent, canActivate: [authGuard] },
  { path: 'resumes/:id/experience', component: ExperienceComponent, canActivate: [authGuard] },
  { path: 'resumes/:id/skills', component: SkillsComponent, canActivate: [authGuard] },
  { path: 'resumes/:id/projects', component: ProjectsComponent, canActivate: [authGuard] },
  { path: 'resumes/:id/certifications', component: CertificationsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
