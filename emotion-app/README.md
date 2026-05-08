# Emotion Diary

Emotion Diary — веб-приложение для ведения дневника эмоционального состояния пользователя с анализом эмоций при помощи GigaChat.

---

# Возможности приложения

## Авторизация

* регистрация пользователя
* вход в аккаунт
* выход из аккаунта
* изменение имени профиля
* смена email
* смена пароля

Для авторизации используется Firebase Authentication.

---

# Дневник эмоций

Пользователь может:

* создавать записи
* редактировать записи
* просматривать список записей
* искать записи
* просматривать детали записи

Каждая запись содержит:

* текст записи
* выбранное эмоциональное состояние
* результат AI-анализа
* рекомендации

---

# AI-анализ эмоций

Для анализа эмоций используется GigaChat API.

Система:

* отправляет текст записи в GigaChat
* получает JSON с анализом
* определяет итоговое эмоциональное состояние
* сохраняет анализ и рекомендации

Поддерживаемые эмоции:

* joy
* calm
* neutral
* anxiety
* sadness
* anger

---

# Dashboard

На dashboard отображается:

* статистика эмоциональных состояний
* история последних записей
* аналитика по эмоциям

---

# Стек технологий

## Frontend

* Angular
* Nx
* TypeScript
* RxJS
* Taiga UI
* LESS

## Backend / Cloud

* Firebase Authentication
* Firebase Firestore
* Firebase Functions
* GigaChat API

## Инструменты

* ESLint
* Prettier
* esbuild

---

# Установка проекта

## 1. Установить Firebase CLI

```bash
npm install -g firebase-tools
```

Проверка:

```bash
firebase --version
```

---


## 2. Установить зависимости

В корне проекта:

```bash
npm install
```

Затем отдельно для Firebase Functions:

```bash
cd functions
npm install
cd ..
```

---

# Запуск приложения

## 1. Запуск Firebase Functions Emulator

Из папки `functions`:

```bash
npm run serve
```

Functions будут доступны локально.

## Возможная проблема с сертификатом GigaChat

При запуске Firebase Functions запросы к GigaChat могут не выполняться из-за SSL-сертификата (сертификата МинЦифры, https://developers.sber.ru/docs/ru/gigachat/certificates?lang=js).

В таком случае необходимо указать сертификат Минцифры через переменную окружения `NODE_EXTRA_CA_CERTS`.

### Windows PowerShell

```powershell
$env:NODE_EXTRA_CA_CERTS="C:\path\to\certificate.pem"
```

### Linux / macOS

```bash
export NODE_EXTRA_CA_CERTS=/path/to/certificate.pem
```

После этого повторно запустить Firebase Functions:

```bash
cd functions
npm run serve
```

---

## 2. Запуск frontend

Из корня проекта:

```bash
nx serve emotion-diary
```

Приложение будет доступно по адресу:

```text
http://localhost:4200
```

---

# Проверка кода

## ESLint

Проверка линтером:
```bash
nx lint
```

Исправления при помощи линтера:
```bash
nx lint:fix
```


## Форматирование

Проверка форматирования:
```bash
nx format:check
```

Запуск форматирования:
```bash
nx format
```

---

# Архитектура

## apps/emotion-diary

Основное Angular-приложение.

## libs/shared

Общие типы, emotion states и shared-константы.

## libs/firebase

Firebase initialization и helper-функции.

## libs/emotion-analysis

Работа с Firebase callable functions.

## functions

Firebase Functions и интеграция с GigaChat.

---


