# Nexus Miner

Nexus Miner — Telegram Mini App с мобильным интерфейсом майнера, еженедельным событием Nexus Reactor и бэкендом на Express, PostgreSQL и Prisma.

## Стек

- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand, axios, lucide-react, Framer Motion.
- Backend: Node.js, Express, PostgreSQL, Prisma, JWT.
- Deploy: Docker Compose, nginx, Redis для будущего кэша сессий.

## API

| Метод | URL | Назначение |
| --- | --- | --- |
| POST | `/api/auth/telegram` | Авторизация через Telegram InitData |
| GET | `/api/user/me` | Текущий пользователь |
| POST | `/api/miner/toggle` | Включить или выключить майнинг |
| POST | `/api/miner/sell` | Продать хэши по курсу 100 = 3 RUB |
| GET | `/api/miner/stats` | Статистика майнинга с серверной синхронизацией |
| GET | `/api/reactor/current` | Текущий Reactor Event |
| POST | `/api/reactor/deposit` | Пополнение Nexus Reactor |

## Логика

- Майнинг начисляет `power * 0.001` хэшей в секунду.
- Клиент визуально обновляет хэши каждую секунду и синхронизируется с API каждые 10 секунд.
- Продажа: `balance += floor(hashes / 100) * 3`, остаток сохраняется через `hashes %= 100`.
- Reactor активен с понедельника 00:00 UTC до субботы 23:59:59 UTC.
- Глобальный прогресс Reactor считается как сумма `reactorDeposits` всех пользователей.

## Переменные окружения

Создайте `.env` из `.env.example`:

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://user:pass@db:5432/nexusminer
BOT_TOKEN=your_telegram_bot_token
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-domain.com
VITE_API_URL=/api
```

## Запуск локально через Docker

```bash
docker-compose up -d
```

После запуска выполните миграции Prisma внутри backend-контейнера:

```bash
docker-compose exec backend npx prisma migrate dev --name init
```

## Деплой Telegram Mini App

1. Создайте бота в `@BotFather` и получите токен.
2. Установите Web App URL: `https://your-domain.com`.
3. Клонируйте репозиторий и перейдите в `nexus-miner`.
4. Создайте `.env` из `.env.example` и заполните значения.
5. Запустите `docker-compose up -d`.
6. Выполните `docker-compose exec backend npx prisma migrate dev --name init`.
7. Откройте бота в Telegram и нажмите «Запустить».

## Разработка без Docker

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```
