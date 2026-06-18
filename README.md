# AI Resume Builder - Phase 1

This phase includes only user registration and login.

Included:

- FastAPI backend auth module
- PostgreSQL `users` table
- SQLAlchemy user model
- Pydantic register, login, and user response schemas
- JWT authentication
- bcrypt password hashing
- Angular login/register pages
- Angular auth service, guard, and HTTP interceptor
- Basic protected dashboard

Not included in this phase:

- Resume builder pages
- AI suggestions
- Resume tables

## Backend Run Commands

```bash
createdb ai_resume_builder
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Frontend Run Commands

```bash
cd frontend
npm install
npm start
```

## PostgreSQL Users Table SQL

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);
```

## Postman Testing

Register:

```text
POST http://localhost:8000/auth/register
```

```json
{
  "full_name": "Demo User",
  "email": "demo@example.com",
  "password": "password123"
}
```

Login:

```text
POST http://localhost:8000/auth/login
```

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

Current user:

```text
GET http://localhost:8000/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Forgot Password Testing

For local development, leave SMTP values empty in `backend/.env`. The backend will print the reset link in the console.

Request reset link:

```text
POST http://localhost:8000/auth/forgot-password
```

```json
{
  "email": "demo@example.com"
}
```

Open the printed link, or call reset directly:

```text
POST http://localhost:8000/auth/reset-password
```

```json
{
  "token": "TOKEN_FROM_RESET_LINK",
  "new_password": "NewPassword@123",
  "confirm_password": "NewPassword@123"
}
```

Manual table SQL is available in `backend/create_password_reset_tokens_table.sql`. The app also creates the table automatically on startup for local development.

## Phase 3: AI Resume Generation

Install Phase 3 backend dependencies:

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

Add Azure OpenAI settings to `backend/.env`:

```text
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=
```

The generated resume table is created automatically on startup for local development. Manual SQL is available in:

```text
backend/create_generated_resumes_table.sql
```

### Postman Testing

Login and copy the JWT:

```text
POST http://localhost:8000/auth/login
```

Generate AI resume:

```text
POST http://localhost:8000/resume-generation/1/generate
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Download PDF:

```text
GET http://localhost:8000/resume-generation/1/download/pdf
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Download Word:

```text
GET http://localhost:8000/resume-generation/1/download/word
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Browser Testing

1. Start backend with Azure OpenAI settings configured.
2. Start frontend with `npm start`.
3. Login.
4. Open `My Resumes`.
5. Open a resume.
6. Click `Generate AI Resume`.
7. Review the generated preview.
8. Click `Download PDF` or `Download Word`.
