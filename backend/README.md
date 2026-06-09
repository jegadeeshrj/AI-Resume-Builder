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
