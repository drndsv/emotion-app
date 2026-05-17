# Emotion Diary

## Architecture
- Frontend: Angular/Nx (`apps/emotion-diary`)
- Backend: Spring Boot (`backend`)
- DB: PostgreSQL (`docker-compose.yml`)

## Run DB
```bash
docker compose up -d postgres
```

## Run backend
```bash
cd backend
mvn spring-boot:run
```

Set env vars: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `GIGACHAT_API_KEY`, `CORS_ORIGIN`.

## Run frontend
```bash
npm ci
npx nx serve emotion-diary
```
Frontend calls backend via `apiUrl` in environment files.

## CI
- GitHub Actions workflows:
  - `.github/workflows/frontend.yml`
  - `.github/workflows/backend.yml`
