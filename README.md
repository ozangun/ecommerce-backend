# E-Commerce Backend API

A production-ready backend infrastructure built with NestJS. It includes secure authentication, database management with Prisma, and automated mail delivery, all protected under a strict rate-limiting shield.

## 🚀 Tech Stack

* **Framework:** NestJS (TypeScript)
* **ORM:** Prisma ORM (PostgreSQL)
* **Auth:** Passport.js with JWT Strategy
* **Security:** `@nestjs/throttler` (Rate Limiting)
* **Mail:** `@nestjs-modules/mailer` (Mailtrap integration)

---

## 🛠️ Key Features

* **Authentication:** Secure register and login flows with `bcrypt` password hashing. Protected routes use a custom `@GetUser()` decorator to easily pull session data.
* **Password Reset Flow:** Generates secure 32-byte tokens via the native `crypto` module. Links automatically expire after 15 minutes. 
* **Token Kill-Switch:** To ensure security, the token is instantly wiped from the database (`resetToken: null`) as soon as the password is reset. A link can never be reused.
* **Rate Limiting:** Protects high-risk endpoints (`login`, `register`, `forgot-password`, `reset-password`) against brute-force and spam by limiting traffic to **3 requests per minute**. Other application routes are globally limited to 20 requests per minute.

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
```bash
npm install

### 2. Environment Variables (.env)
Create a .env file in the root directory and add your configurations:

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-super-secret-jwt-key"

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_password
MAIL_FROM="E-Commerce <noreply@yourdomain.com>"

### 3. Database Migrations
npx prisma migrate dev

### 4. Run the App
# Development mode
npm run start:dev

# Production mode
npm run start:prod

Method,Endpoint,Description,Rate Limit / Guard
POST,/auth/register,Create a new user account,3 requests / min
POST,/auth/login,Authenticate and get JWT token,3 requests / min
GET,/auth/me,Fetch active user profile,JWT Guard
POST,/auth/forgot-password,Trigger password reset email,3 requests / min
POST,/auth/reset-password,Update password using token,3 requests / min
