CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_title VARCHAR(160) NOT NULL,
    professional_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_resumes_user_id ON resumes(user_id);

CREATE TABLE IF NOT EXISTS personal_details (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(30)
);

CREATE INDEX IF NOT EXISTS ix_personal_details_resume_id ON personal_details(resume_id);

CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    degree VARCHAR(160) NOT NULL,
    institution VARCHAR(180) NOT NULL,
    field_of_study VARCHAR(160),
    start_year INTEGER,
    end_year INTEGER,
    grade VARCHAR(60),
    description TEXT
);

CREATE INDEX IF NOT EXISTS ix_education_resume_id ON education(resume_id);

CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    company_name VARCHAR(180) NOT NULL,
    job_title VARCHAR(160) NOT NULL,
    employment_type VARCHAR(80),
    start_date DATE,
    end_date DATE,
    currently_working BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT
);

CREATE INDEX IF NOT EXISTS ix_experience_resume_id ON experience(resume_id);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    skill_name VARCHAR(120) NOT NULL,
    skill_level VARCHAR(60)
);

CREATE INDEX IF NOT EXISTS ix_skills_resume_id ON skills(resume_id);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    project_name VARCHAR(180) NOT NULL,
    technologies VARCHAR(255),
    project_url VARCHAR(255),
    description TEXT
);

CREATE INDEX IF NOT EXISTS ix_projects_resume_id ON projects(resume_id);

CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    certification_name VARCHAR(180) NOT NULL,
    issuing_organization VARCHAR(180) NOT NULL,
    issue_date DATE,
    expiration_date DATE,
    credential_id VARCHAR(120),
    credential_url VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS ix_certifications_resume_id ON certifications(resume_id);
