# Emotion Diary

## Архитектура
- Frontend: Angular + Nx (`apps/emotion-diary`)
- Backend: Spring Boot (`backend`)
- БД: PostgreSQL (`docker-compose.yml`)
- Анализ эмоций: только через backend → GigaChat

## Переменные окружения backend
- `DB_URL` (default `jdbc:postgresql://localhost:5432/emotion_diary`)
- `DB_USER` (default `emotion`)
- `DB_PASSWORD` (default `emotion`)
- `JWT_SECRET`
- `CORS_ORIGIN` (default `http://localhost:4200`)
- `GIGACHAT_AUTH_URL` (default `https://ngw.devices.sberbank.ru:9443/api/v2/oauth`)
- `GIGACHAT_API_URL` (default `https://gigachat.devices.sberbank.ru/api/v1/chat/completions`)
- `GIGACHAT_CREDENTIALS` (обязательно, base64 client_id:client_secret)
- `GIGACHAT_SCOPE` (default `GIGACHAT_API_PERS`)

## Запуск PostgreSQL
```bash
docker compose up -d postgres
```

## Запуск backend
```bash
cd backend
mvn spring-boot:run
```

## Запуск frontend
```bash
npm ci
npx nx serve emotion-diary
```

## Пример запроса анализа
```bash
curl -X POST http://localhost:8080/api/emotion/analyze \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"text":"Мне тревожно, но хочу собраться"}'
```
