# 💊 MediStore Server

![OTC Only](https://img.shields.io/badge/Medicines-OTC%20Only-green)
![API](https://img.shields.io/badge/API-REST-blue)
![Role Based](https://img.shields.io/badge/Auth-Role%20Based-orange)

Backend API for an **Online OTC (Over-The-Counter) Medicine Marketplace**.

Live Link: https://medi-store-server-delta.vercel.app/

This platform allows:

- 🧑 Customers to browse and purchase medicines
- 🏪 Sellers to manage inventory and orders
- 🛡 Admins to manage users

---

# 💊 MediStore – OTC Medicine Marketplace

A full-stack e-commerce platform for Over-The-Counter (OTC) medicines with secure payment integration, role-based access control, and production-ready backend architecture.

---

## 🚀 Live Demo

🔗 https://your-live-link.com

---

## 🧑‍💻 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** Better Auth (Role-Based Access Control)
- **Payments:** Stripe (Webhook-based verification)
- **Deployment:** Vercel

---

## ✨ Key Features

### 🔐 Secure Authentication & Authorization

- Better Auth Authentication
- Role-based access (Admin / Seller / Customer)

### 🛒 E-commerce Flow

- Add to cart
- Checkout system
- Order placement

### 💳 Stripe Payment Integration

- Secure checkout session
- Webhook-based payment confirmation
- Prevents fake/success URL manipulation

### 📦 Order Management

- User order history
- Admin order control

### ⚡ Optimized Backend

- Modular architecture
- Prisma ORM for scalable DB queries
- Pagination & filtering support

---

## 🧠 Project Highlights

- ✅ Implemented **Stripe Webhooks** to ensure real payment verification
- ✅ Designed a **scalable backend structure** (modular services & controllers)
- ✅ Built a **production-ready REST API** with proper error handling
- ✅ Handled **concurrent API requests & optimized response flow**

---

# 🔐 Authentication

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| `POST` | `/api/auth/register` | Register new user              |
| `POST` | `/api/auth/login`    | Login user                     |
| `GET`  | `/api/auth/me`       | Get current authenticated user |

---

# 💊 Medicines (Public)

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| `GET`  | `/api/medicines`     | Get all medicines with filters |
| `GET`  | `/api/medicines/:id` | Get medicine details           |
| `GET`  | `/api/categories`    | Get all categories             |

---

# 📦 Orders

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| `POST` | `/api/orders`     | Create new order  |
| `GET`  | `/api/orders`     | Get user's orders |
| `GET`  | `/api/orders/:id` | Get order details |

---

# 🏪 Seller Management

| Method   | Endpoint                    | Description         |
| -------- | --------------------------- | ------------------- |
| `POST`   | `/api/seller/medicines`     | Add medicine        |
| `PUT`    | `/api/seller/medicines/:id` | Update medicine     |
| `DELETE` | `/api/seller/medicines/:id` | Remove medicine     |
| `GET`    | `/api/seller/orders`        | Get seller's orders |
| `PATCH`  | `/api/seller/orders/:id`    | Update order status |

---

# 🛡 Admin Panel

| Method  | Endpoint               | Description        |
| ------- | ---------------------- | ------------------ |
| `GET`   | `/api/admin/users`     | Get all users      |
| `PATCH` | `/api/admin/users/:id` | Update user status |

---

# 🔄 Application Flow

## 💊 Customer Journey

```text
Register
   ↓
Browse Shop
   ↓
Add to Cart
   ↓
Checkout
   ↓
Pay
   ↓
Track Order
```

---

## 🏪 Seller Journey

```text
Register
   ↓
Add Medicines
   ↓
Manage Stock
   ↓
View Orders
   ↓
Update Status
```

---

# 📊 Order Status Lifecycle

```text
[ ORDER CREATED ]
        │
 ( PENDING_PAYMENT ) ────────────────┐
        │                            │
   [ STRIPE CHECKOUT ]              │
        │                            │
 ( Payment Success )         ( Payment Failed / Expired )
        │                            │
        ↓                            ↓
     [ PLACED ]            [ CANCELLED / FAILED ]
        │
   [ PROCESSING ]
        │
    [ SHIPPED ]
        │
   [ DELIVERED ]
```

### Status Definitions

| Status       | Meaning                        |
| ------------ | ------------------------------ |
| `PLACED`     | Order created by customer      |
| `PROCESSING` | Seller confirmed and preparing |
| `SHIPPED`    | Order dispatched               |
| `DELIVERED`  | Successfully delivered         |
| `CANCELLED`  | Cancelled before confirmation  |

---

# 👥 Roles & Permissions

## 🧑 Customer

- Browse medicines
- Place orders
- Track orders

## 🏪 Seller

- Add / Update / Delete medicines
- Manage stock
- View and update order status

## 🛡 Admin

- View all users
- Update user status

---

# 🔐 Access Control

- 🌍 Public Access → Medicines & Categories
- 🔑 Authenticated Users → Orders
- 🏪 Seller Role Required → Seller endpoints
- 🛡 Admin Role Required → Admin endpoints

---

## 🔄 Payment Flow

1. User clicks **Checkout**
2. Stripe session is created
3. User completes payment
4. Stripe Webhook triggers backend
5. Order is marked as **paid (verified)**
6. Data stored securely in DB

👉 Ensures **no fake payment success**

---
