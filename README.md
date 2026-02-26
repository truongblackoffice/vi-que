# Vị Quê (My Tho & Dong Thap Specialties Marketplace)

Vị Quê is a full-stack local specialty marketplace web application connecting buyers with local sellers from My Tho, Dong Thap, and the Mekong Delta regions. Built with a robust Golang (Gin + GORM) MVC backend and a modern Next.js 14 frontend.

## 🚀 Key Features
- **Public**: Responsive Homepage with vibrant Mekong Delta aesthetics, Advanced Product filtering (category, search, origin).
- **Auth**: JWT Authentication (Access + Refresh tokens), Role-based Access Control (Buyer, Seller, Admin).
- **Buyer**: Add to Cart, Checkout flow with Address capture, Order History tracking, Product Reviews.
- **Seller**: Dashboard for managing listed products (CRUD), managing incoming orders and tracking revenue.
- **Admin**: Dashboard overlay to monitor total system-wide local orders.
- **Security**: Rate limit middlewares, security headers, password hashing (bcrypt).

## 🛠️ Technology Stack
**Backend**: Golang 1.23, Gin, GORM, PostgreSQL 16
**Frontend**: Next.js 14, Tailwind CSS, shadcn/ui, Zustand, Axios, Framer Motion
**DevOps**: Docker, Docker Compose

---

## 🏗️ Local Setup Instructions

### 1. Using Docker Compose (Recommended)
This will spin up PostgreSQL, PgAdmin, Backend API, and Frontend web.

1. Create a `.env` in `/frontend` by copying `.env.example`:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Create `.env` in `/backend` by copying `.env.example`:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Run docker-compose:
   ```bash
   docker compose up -d --build
   ```

* Note: The backend contains an automatic auto-migration which will run on startup. You may optionally start the backend locally passing `--seed` to seed fake data.

### 2. Manual Setup
**Database**:
- Ensure PostgreSQL is running locally on port 5432 with user `postgres:postgres` and db `vique`.

**Backend**:
```bash
cd backend
# Run server and seed data
go run cmd/main.go cmd/seed.go --seed
```
Backend will run on `http://localhost:8080`.

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`.

---

## 🔑 Default Accounts (Seeded)

The database will be automatically seeded when running the backend with `--seed`.

**Admin Profile**
- Email: `admin@vique.local`
- Pass: `Admin@123`

**Seller Profiles**
- Email: `seller1@vique.local`
- Pass: `Seller@123`

**Buyer Profiles**
- Email: `buyer1@vique.local`
- Pass: `Buyer@123`

*(Alternatively, you can register new accounts dynamically via the frontend).*

---

## 📡 API Endpoint Overview

### Auth (`/api/auth`)
- `POST /register` - Name, Email, Password, Role
- `POST /login` - Email, Password
- `POST /refresh` - Refresh session cookies
- `POST /logout` - Clear session

### Products (`/api/products`)
- `GET /` - List all products
- `GET /slug/:slug` - Product details
- `GET /:product_id/reviews` - Product reviews

### Categories (`/api/categories`)
- `GET /` - List all generic categories

### Cart & Orders (`/api/orders`)
- `POST /` (Buyer) - Submit new order
- `GET /` (Buyer/Seller) - Get related orders
- `GET /:id` - Get specific order by ID
- `PUT /:id/status` - Update order progression

### Seller (`/api/seller/products`)
- `POST /` - Register new product
- `PUT /:id` - Update existing product
- `DELETE /:id` - Unlist product

### Admin (`/api/admin/orders`)
- `GET /` - List complete history of orders and metrics

---

## 📌 Delivered By
Developed strictly following modern MVC architectural principles, UI/UX aesthetics, and comprehensive Golang security models.
