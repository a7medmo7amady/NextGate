<img src="frontend/public/logo.svg" alt="NextGate Logo" width="300"/>

# NextGate — Flight Booking System

A full-stack flight booking platform built with **Next.js**, **Express**, and **MongoDB**. Users can search and book flights, manage their bookings, and authenticate via credentials or Google OAuth.

---

## Tech Stack

### Frontend

| Technology | Role |
|---|---|
| **Next.js 16** (App Router) | React framework — routing, SSR, layouts |
| **React 19** | UI component model with the new compiler |
| **TypeScript** | Static typing across all frontend code |
| **Tailwind CSS v4** | Utility-first styling |

### Backend

| Technology | Role |
|---|---|
| **Node.js + Express 5** | HTTP server and REST API |
| **MongoDB + Mongoose** | Document database — flights, bookings, users |
| **JWT** | Stateless authentication tokens |
| **Passport.js + Google OAuth 2.0** | Social login via Google |
| **Nodemailer** | Transactional email (booking confirmations, verification) |
| **bcryptjs** | Password hashing |
| **Helmet** | HTTP security headers |
| **express-validator** | Input validation and sanitisation |

---

## Features

- **Flight search** — browse and filter available flights
- **Booking** — reserve seats and receive email confirmation
- **Booking history** — view and manage past and upcoming bookings
- **Authentication** — register/login with email+password or Google OAuth
- **Email verification** — verify account via emailed link
- **JWT-protected routes** — secure API endpoints with token auth
- **Return flight logic** — support for round-trip bookings

---

## Getting Started

### With Docker (recommended)

```bash
# Copy and fill in environment variables
cp .env.example .env

docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Without Docker

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```


---

## License

[MIT](LICENSE)
