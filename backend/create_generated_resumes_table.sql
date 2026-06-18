CREATE TABLE IF NOT EXISTS generated_resumes (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    generated_content TEXT NOT NULL,
    format_type VARCHAR(30) NOT NULL DEFAULT 'ai_json',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_generated_resumes_resume_id ON generated_resumes(resume_id);
CREATE INDEX IF NOT EXISTS ix_generated_resumes_user_id ON generated_resumes(user_id);
