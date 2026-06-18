# AI Resume Builder Backend - Phase 1 Auth

This backend includes only user registration, login, JWT authentication, and the `/auth/me` profile endpoint.

## 1. Create PostgreSQL Database

```bash
createdb ai_resume_builder
```

Manual users table SQL is available in `create_users_table.sql`:

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

The app also creates the table automatically on startup for local development.

## 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Update `DATABASE_URL` in `.env` with your PostgreSQL username and password.

## 3. Install and Run

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs:

```text
http://localhost:8000/docs
```

## Postman Testing Steps

### Register

`POST http://localhost:8000/auth/register`

```json
{
  "full_name": "Demo User",
  "email": "demo@example.com",
  "password": "password123"
}
```

### Login

`POST http://localhost:8000/auth/login`

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

Copy the `access_token` from the response.

### Get Current User

`GET http://localhost:8000/auth/me`

Header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Forgot Password Testing

Add these optional email settings to `.env` when SMTP is available:

```text
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
FRONTEND_RESET_PASSWORD_URL=http://localhost:4200/reset-password
```

If SMTP is not configured, the reset link is printed in the FastAPI console.

### Request Reset Link

`POST http://localhost:8000/auth/forgot-password`

```json
{
  "email": "demo@example.com"
}
```

The response is always generic:

```json
{
  "message": "If the email exists, a password reset link has been sent."
}
```

### Reset Password

`POST http://localhost:8000/auth/reset-password`

```json
{
  "token": "TOKEN_FROM_RESET_LINK",
  "new_password": "NewPassword@123",
  "confirm_password": "NewPassword@123"
}
```

Manual table SQL is available in `create_password_reset_tokens_table.sql`.

## Phase 3: AI Resume Generation

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure Azure OpenAI:

```text
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=
```

Manual generated resume table SQL:

```text
create_generated_resumes_table.sql
```

### Generate Resume

`POST http://localhost:8000/resume-generation/{resume_id}/generate`

Header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Download PDF

`GET http://localhost:8000/resume-generation/{resume_id}/download/pdf`

Header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Download Word

`GET http://localhost:8000/resume-generation/{resume_id}/download/word`

Header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```
