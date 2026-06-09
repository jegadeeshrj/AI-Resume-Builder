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
