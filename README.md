# E-Commerce Backend API

A production-ready backend infrastructure built with NestJS. It features secure authentication, optimized database management with Prisma, a dynamic shopping cart system, automated mail delivery, and typo-tolerant search capabilities—all protected under a strict rate-limiting shield.

## 🚀 Tech Stack

* **Framework:** NestJS (TypeScript)
* **Database:** PostgreSQL with Prisma ORM
* **Auth:** Passport.js with JWT Strategy
* **Cache:** Redis (Cache-Manager)
* **Search Engine:** Elasticsearch
* **Environment:** Docker & Docker Compose
* **Security:** `@nestjs/throttler` (Rate Limiting) & `bcrypt` (Hashing)
* **Mail:** `@nestjs-modules/mailer` (Mailtrap integration)

---

## 🛠️ Key Features

### 🔐 Security & Authentication
* **Auth Flows:** Secure register and login pipelines with `bcrypt` password hashing. Protected routes use a custom `@GetUser()` decorator to extract session data.
* **Password Reset Flow:** Generates secure 32-byte tokens via the native `crypto` module. Links automatically expire after 15 minutes.
* **Token Kill-Switch:** The reset token is instantly wiped from the database (`resetToken: null`) as soon as the password is changed, ensuring a link can never be reused.
* **Rate Limiting Protection:** High-risk endpoints (`login`, `register`, `forgot-password`, `reset-password`) are strictly limited to **3 requests per minute** to prevent brute-force attacks. Other global application routes are limited to 20 requests per minute.

### 🛒 Dynamic Cart & Order Management
* **Smart Upsert Logic:** Adding products to the cart automatically handles both item initialization and multi-item quantities without duplicate records.
* **Data Integrity:** Leverages PostgreSQL composite unique constraints (`cartId_productId`) at the database layer.
* **Deep Nested Fetching:** Optimized Prisma `include` queries fetch Cart ➔ CartItems ➔ Product details in a single database round-trip.
* **Dynamic Item Management:** Automatically purges the `CartItem` record from the database if its quantity drops to zero or below during depletion requests.
* **Stok Control & Orders:** Validates inventory availability in real-time during checkout and automatically deducts stock upon successful orders.

### ⚡ Performance & Smart Search
* **Fuzzy Product Search:** Integrated with Elasticsearch utilizing `fuzziness: 'AUTO'`. It intelligently catches typos (e.g., matching "iphone" even if the user types "iphne").
* **Redis Caching:** Accelerates frequent product listings (`getAllProducts`). The cache is automatically evicted (`cacheManager.del`) whenever a new product is created to guarantee data consistency.
* **Automated Mail:** Integrated Mailtrap workflow to dispatch transactional emails (e.g., password reset tokens, order confirmations) asynchronously.

---

## 🐳 Docker Infrastructure

The project utilizes Docker Compose to manage local infrastructure dependencies. Running the environment spins up the following standalone services:

| Service | Image | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **PostgreSQL** | `postgres` | `5432` | Relational database handling users, products, carts, and orders. |
| **Redis** | `redis` | `6379` | In-memory data store optimizing heavy read queries via caching. |
| **Elasticsearch** | `elasticsearch` | `9200` | Full-text search engine executing fast and fuzzy product inquiries. |

---

## ⚙️ Setup & Installation

| Step | Task | Command / Configuration |
| :--- | :--- | :--- |
| **1** | Install Dependencies | `npm install --legacy-peer-deps` |
| **2** | Infrastructure Setup | `docker-compose up -d` |
| **3** | Environment Variables | Create a `.env` file in the root directory (Template below) |
| **4** | Database Migrations | `npx prisma migrate dev` |
| **5** | Run (Development) | `npm run start:dev` |
| **6** | Run (Production) | `npm run start:prod` |

### `.env` Template
```env
DB_PASSWORD=your_super_secret_password_here
DATABASE_URL=postgresql://postgres:your_super_secret_password_here@localhost:5432/ecommerce?schema=public

JWT_SECRET=your_jwt_secret_key_here

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_pass
MAIL_FROM="No Reply <noreply@ecommerce.com>"

REDIS_HOST=localhost
REDIS_PORT=6379
ELASTICSEARCH_NODE=http://localhost:9200
```

---

## 📌 API Endpoints

http://localhost:3000/api
