# My E-Commerce Journey: NestJS & Prisma Backend

Hi! I built this project to challenge myself and step up from standard Express.js into production-grade backend architecture. After studying Computer Programming, I wanted to learn how large-scale enterprise applications are structured, which led me straight to NestJS.

This is a functional e-commerce REST API focused on clean architecture, strict data validation, and secure authentication.

## 🧠 Why I Built It This Way

* **Why NestJS over Express?** I wanted to move away from the "wild west" style of Express and learn a structured, modular framework. NestJS forces me to write maintainable code using Modules and Services, which is what real-world companies actually use.
* **Why Prisma & PostgreSQL?** Writing raw SQL can get messy. I chose Prisma ORM for its type-safety and combined it with PostgreSQL because relational databases make the most sense for structured e-commerce data (Users, Roles, Products).
* **Strict Validation:** In `main.ts`, I explicitly enabled `whitelist: true` and `forbidNonWhitelisted: true`. I did this to ensure the API immediately rejects any unexpected or malicious payloads—security first.

## 🛠️ Tech Stack I Used

* **Framework:** NestJS (Node.js)
* **Language:** TypeScript
* **ORM:** Prisma
* **Database:** PostgreSQL
* **Security:** JWT (JSON Web Tokens), Bcrypt for password hashing

## 📂 Current Progress

* **[x] Auth Module:** Secure `signUp` and `signIn` flow. Passwords are never stored in plain text (hashed with bcrypt).
* **[x] User Module:** Profile management with Role-Based Access Control (`USER` and `ADMIN` enums).
* **[ ] Products & Cart (Next Up):** Currently planning the database relations for products, categories, and shopping carts.

## 🚀 How to Run It Locally

1. Clone the repo: `git clone https://github.com/ozangun/ecommerce-backend`
2. Install dependencies: `npm install`
3. Set up your `.env` file (Database URL and JWT Secret)
4. Run Prisma migrations: `npx prisma migrate dev`
5. Start the server: `npm run start:dev`
