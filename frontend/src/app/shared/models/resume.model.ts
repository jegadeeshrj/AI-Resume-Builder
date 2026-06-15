export interface Resume {
  id: number;
  user_id: number;
  resume_title: string;
  professional_summary?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonalDetails {
  id: number;
  resume_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
}

export interface Education {
  id: number;
  resume_id: number;
  degree: string;
  institution: string;
  field_of_study?: string | null;
  start_year?: number | null;
  end_year?: number | null;
  grade?: string | null;
  description?: string | null;
}

export interface Experience {
  id: number;
  resume_id: number;
  company_name: string;
  job_title: string;
  employment_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  currently_working: boolean;
  description?: string | null;
}

export interface Skill {
  id: number;
  resume_id: number;
  skill_name: string;
  skill_level?: string | null;
}

export interface Project {
  id: number;
  resume_id: number;
  project_name: string;
  technologies?: string | null;
  project_url?: string | null;
  description?: string | null;
}

export interface Certification {
  id: number;
  resume_id: number;
  certification_name: string;
  issuing_organization: string;
  issue_date?: string | null;
  expiration_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
}

export interface ResumeDetail extends Resume {
  personal_details?: PersonalDetails | null;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}
