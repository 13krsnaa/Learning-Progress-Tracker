# 🚀 Learning Progress Tracker

A comprehensive, full-stack solution to track your learning journey, visualize progress, and stay motivated. Built with the MERN stack and modern DevOps practices.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **📘 NEW TO THE PROJECT?** Start with [GETTING_STARTED.md](./docs/GETTING_STARTED.md) (Coming Soon)
> 
> **🔄 WANT TO CONTRIBUTING?** Read [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

---

## 📖 Table of Contents
1. [High-Level Architecture](#-high-level-architecture)
2. [Complete System Flow](#-complete-system-flow)
3. [Key Features](#-key-features)
4. [Technology Stack](#-technology-stack)
5. [Quick Start Guide](#-quick-start-guide)
6. [Project Structure](#-project-structure)
7. [API Documentation](#-api-documentation)

---

## 🏗 High-Level Architecture

```mermaid
graph TD
    Client[Client (React + Vite)]
    Gateway[API Gateway / Server (Express)]
    Auth[Auth Controller]
    Goals[Goals Controller]
    Logs[Logs Controller]
    DB[(MongoDB)]
    Cache[(Redis)]

    Client -->|HTTP/REST| Gateway
    Gateway --> Auth
    Gateway --> Goals
    Gateway --> Logs
    
    Auth --> DB
    Goals --> DB
    Logs --> DB
    
    Goals -->|Cache| Cache
    Logs -->|Cache| Cache
```

**Architecture Overview:**
- **Client**: A responsive, modern frontend built with React, TailwindCSS, and Framer Motion.
- **Server**: A robust Node.js/Express backend handling API requests, authentication, and business logic.
- **Database**: MongoDB for persistent storage of user data, goals, and logs.
- **Caching**: Redis integration for high-performance data retrieval.

---

## 🔄 Complete System Flow

### **1. User Authentication Flow**

```
┌─────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│ Client  │────────▶│  Server  │────────▶│Auth Ctrl │────────▶│ MongoDB  │
│         │  POST   │          │  Verify │          │  Store  │          │
│         │ /login  │          │         │          │         │          │
└─────────┘         └──────────┘         └────┬─────┘         └──────────┘
     ▲                                        │
     │                                        │ bcrypt verify
     │                                        ▼ 
     └────────────────────────────────── JWT Token
                     Return
```

**Flow Steps:**
1. Client sends credentials (email/password).
2. Server validates input.
3. Auth Controller checks MongoDB for user.
4. If valid, generates JWT Token (HS256).
5. Returns token to client for session management.

### **2. Goal Tracking Flow**

1. **Create Goal**: User defines a learning goal (e.g., "Learn Docker").
2. **Log Progress**: User adds daily logs/milestones.
3. **Visualization**: System aggregates logs and updates the Dashboard charts.
4. **Caching**: Frequently accessed goal data is cached in Redis for speed.

---

## ⚡ Key Features

- **Authentication**: Secure JWT-based login and signup with Email OTP support.
- **Dashboard**: Real-time visualization of learning progress using Recharts.
- **Leaderboard**: Gamified experience comparing progress with other users.
- **Resources Implementation**: Curated list of learning resources.
- **Dark Mode**: Sleek "Dark Neon" UI with glassmorphism effects.
- **Responsive Design**: Fully optimized for mobile and desktop.

---

## 🛠 Technology Stack

### **Frontend**
- **Runtime**: React 18+
- **Build Tool**: Vite
- **Styling**: TailwindCSS, PostCSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Caching**: Redis (ioredis)
- **Validation**: Zod (planned/in-progress) or Manual

### **DevOps & Tools**
- **Version Control**: Git
- **Package Manager**: NPM
- **Linting**: ESLint

---

## 🚀 Quick Start Guide

### **Prerequisites**
- Node.js 18+
- MongoDB (Local or Atlas)
- Redis (Optional, for caching features)

### **1. Clone Repository**
```bash
git clone <repository-url>
cd "Learning Progress Tracker"
```

### **2. Environment Setup**

Create `.env` file in `server/` directory:

```bash
# server/.env
PORT=5000
MONGO_URI="mongodb://localhost:27017/learning-tracker"
JWT_SECRET="your_jwt_secret_key"
REDIS_URL="redis://localhost:6379"
# Validation & Email Services
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"
```

### **3. Install Dependencies**

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd ../client
npm install
```

### **4. Start Application**

**Start Server:**
```bash
# In server directory
npm run dev
# Server running on http://localhost:5000
```

**Start Client:**
```bash
# In client directory
npm run dev
# Client running on http://localhost:5173
```

---

## 📂 Project Structure

```
Learning Progress Tracker/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages (Dashboard, Login, etc.)
│   │   ├── context/        # React Context (Auth, Theme)
│   │   └── api.js          # API integration
│   └── ...
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/         # App configuration
│   │   ├── db/             # Database connections (Mongo, Redis)
│   │   ├── routes/         # API Routes
│   │   └── ...
│   └── ...
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```text
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Contributors

- **Developer**: [Your Name/Handle]

---

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Ensure MongoDB is running locally (`mongod`) or check your Atlas URI.
- Check `MONGO_URI` in `.env`.

**2. Redis Connection Error**
- If you don't have Redis installed, you may need to disable the Redis connection code in `server/src/index.js` or install Redis.

**3. CORS Issues**
- Ensure `cors` middleware is enabled in `server/src/index.js` and allows the client origin.
