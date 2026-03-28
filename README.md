# 🏦 Virtual Bank – Full Stack Banking Platform

A modern full-stack banking application that enables secure account management, real-time transactions, and transaction tracking.  
The system simulates real-world banking operations with authentication, session handling, and persistent storage.

---

## 🚀 Overview

This project demonstrates **end-to-end full stack development skills**, including:

- Secure authentication (PIN + JWT)
- RESTful API development
- Database integration (MongoDB)
- Cloud deployment (Vercel + Render)

Users can create accounts, log in securely, perform transactions, and view transaction history.

---

## 🛠️ Tech Stack

### Frontend
- React.js / HTML, CSS, JavaScript
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### Deployment
- Frontend: Vercel  
- Backend: Render  

---

## ✨ Features

- 🔐 Secure Login System (Account Number + PIN)
- 👤 Create Bank Account (Auto-generated Account Number)
- 💰 Deposit Money
- 🏧 Withdraw Money
- 💸 Transfer Funds
- 📜 Transaction History Tracking
- 🔄 Session Management (Login/Logout)
- 🌐 Public Cloud Deployment

---

## 📦 Project Structure

```
virtual-bank-app/
│
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── package.json
│
└── README.md
```

---

## 🔗 API Endpoints

### Authentication
```
POST /login
```

### Account
```
POST /create-account
POST /account-info
```

### Transactions
```
POST /deposit
POST /withdraw
POST /transfer
GET  /transactions
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/SunnySurendra-166/virtual-bank-app.git
cd virtual-bank-app
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm start
```

---

## 🌐 Live Demo

Frontend: https://virtual-bank-app.vercel.app  
Backend: https://virtual-bank-backend.onrender.com  

---

## ⚠️ Important Notes

- Backend must use `process.env.PORT`
- MongoDB Atlas connection required in `.env`
- Enable CORS in backend
- Render free tier may sleep after inactivity (first request may take time)

---

## 🔮 Future Enhancements

- Role-based access (Admin/User)
- Email/SMS notifications
- Advanced analytics dashboard
- Microservices architecture upgrade
- Kubernetes deployment

---

## 👨‍💻 Author

Sunny Surendra  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!