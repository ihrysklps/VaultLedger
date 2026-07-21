# VaultLedger

> **A production-inspired banking backend that demonstrates secure authentication, atomic transactions, double-entry ledger accounting, and idempotent payment processing—designed using scalable backend engineering principles.**

## ✨ Features

- 🔐 Secure JWT-based Authentication
- 🔒 Password Hashing using bcrypt
- 🍪 Cookie-based Authentication
- 🏦 Account Creation & Management
- 💸 Idempotent Money Transfers
- 📒 Double-entry Ledger Accounting
- ⚡ Atomic MongoDB Transactions
- 📊 Real-time Balance Calculation
- 📧 Email Notifications
- 🚪 Secure Logout with Token Blacklisting
- 🛡️ Protected API Routes

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt |
| **Email Service** | Nodemailer |
| **Middleware** | Cookie Parser |
| **Environment** | dotenv |

## 📂 Project Structure

```text
VaultLedger/
│
├── src/
│   ├── config/          # Database & application configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication & custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic & email services
│   ├── utils/           # Helper functions
│   └── app.js           # Express application
│
├── .env.example
├── package.json
├── README.md
└── server.js
```
## 🚀 Engineering Highlights

- 🏦 Simulates a **production-grade banking backend** with secure account and transaction management.
- 📒 Implements **Double-entry Ledger Accounting**, ensuring every financial transaction remains balanced and traceable.
- ⚡ Guarantees **transaction atomicity** using MongoDB Sessions, eliminating partial or inconsistent transfers.
- 🔁 Supports **idempotent transactions** to safely handle duplicate client requests without duplicate payments.
- 📊 Leverages **MongoDB Aggregation Pipelines** to compute account balances directly from ledger entries instead of storing mutable balances.
- 🔐 Secures APIs using **JWT Authentication**, **Password Hashing (bcrypt)**, and **Token Blacklisting** for reliable logout and session invalidation.
- 🛡️ Follows a **layered MVC architecture** with modular routing, middleware, and service layers for maintainability.
- 📧 Integrates **event-driven email notifications** for account activities and transaction updates.
- 🚀 Built using **RESTful API principles** with a focus on scalability, consistency, and real-world backend engineering.

## Why VaultLedger ?

VaultLedger was developed to bridge the gap between academic projects and production-grade backend systems. Instead of focusing on simple CRUD functionality, it emphasizes transactional integrity, secure authentication, and financial record consistency through features such as double-entry bookkeeping, MongoDB transactions, and idempotent payment processing—concepts commonly used in modern fintech platforms.
