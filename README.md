# VaultLedger

A production-inspired banking backend built with Node.js, Express, MongoDB, and JWT authentication featuring double-entry ledger accounting, idempotent transactions, and secure account management.

#Features
JWT Authentication
Password Hashing (bcrypt)
Cookie-based Authentication
Account Creation & Management
Double-entry Ledger
Idempotent Money Transfers
MongoDB Transactions
Email Notifications
Token Blacklisting (Logout)
Balance Calculation using Ledger Entries

#Tech Stack
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Nodemailer
Cookie Parser

#Project Structure
src
├── config
├── controllers
├── middleware
├── models
├── routes
├── services
└── app.js

# Why VaultLedger ?

VaultLedger was developed to bridge the gap between academic projects and production-grade backend systems. Instead of focusing on simple CRUD functionality, it emphasizes transactional integrity, secure authentication, and financial record consistency through features such as double-entry bookkeeping, MongoDB transactions, and idempotent payment processing—concepts commonly used in modern fintech platforms.
