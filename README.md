# bus-booking-api

This repository contains a Node.js + Express backend API for a bus booking system and a Vue 3 web UI in `bus-booking-ui`.

## Backend setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure MySQL credentials in `config/config.json` or create a `.env` from `.env.example`.
3. Run migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```
4. Seed demo data:
   ```bash
   npx sequelize-cli db:seed:all
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

## Web UI setup

1. Change into the frontend folder:
   ```bash
   cd bus-booking-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the web app:
   ```bash
   npm run dev
   ```

## Auth

This backend now supports JWT-based auth. Add JWT settings to `.env` and use the authentication endpoints below.

### Auth endpoints
- `POST /auth/register` — create a new user
- `POST /auth/login` — login and receive `accessToken` + `refreshToken`
- `POST /auth/refresh` — refresh access token with a valid refresh token
- `POST /auth/logout` — revoke a refresh token

### Protected endpoints
- `GET /bookings` — returns bookings for the authenticated user
- `POST /bookings/hold` — lock a seat for the authenticated user
- `POST /bookings/confirm` — confirm a held booking
- `POST /bookings/cancel` — cancel a held booking

The web app is already configured to proxy API calls to `http://localhost:3000`.
