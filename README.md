# 🍹 Makebar React & Express Backend

A full‑stack food and beverage ordering system.  
Frontend built with **React Native (Expo)**, backend powered by **Express.js + MySQL**.

---

## 📖 Description and Documentations
Makebar is a simple ordering app where **users** can browse menus, add items to their cart, and place orders, while **sellers** manage menus and track incoming orders. It includes authentication, role‑based access, cart, order history, and status updates.

### User Interface 
<img width="5088" height="1650" alt="DOCUMENTATION MAKEBAR GITHUB PENJUAL-01" src="https://github.com/user-attachments/assets/3c61600c-d9fc-4376-a4b9-b877f3a34edf" />
<img width="5088" height="1650" alt="DOCUMENTATION MAKEBAR GITHUB user-01" src="https://github.com/user-attachments/assets/e85e6e83-fead-42ab-a8a6-9256b588388d" />

### Database Structure
<img width="1106" height="179" alt="image" src="https://github.com/user-attachments/assets/f24044ba-c8d2-4f4b-b516-a49835cbfb05" />
<img width="1023" height="173" alt="menus" src="https://github.com/user-attachments/assets/439a7741-d34b-4681-9d02-73009bbc64b0" />
<img width="1408" height="252" alt="orders" src="https://github.com/user-attachments/assets/ed3d6315-448e-4f81-9968-3efa3008ef83" />
<img width="945" height="192" alt="order_items" src="https://github.com/user-attachments/assets/73a994b7-aad7-4254-88e9-2029e3e498e6" />
<img width="1045" height="167" alt="users" src="https://github.com/user-attachments/assets/ab39f025-be16-40bf-9f54-ffe01a54d1a0" />

---

## ✨ Features
- User & Seller authentication (register/login with bcrypt)
- Role‑based access (`user` and `seller`)
- Menu management (add, edit, delete)
- Cart & checkout flow
- Order history for users
- Incoming orders for sellers
- Order status updates (`pending`, `confirmed`, `completed`, `cancelled`)

---

## 🛠️ Tech Stack
- **Frontend:** React Native (Expo), TypeScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL (WispByte hosting)
- **Libraries:** mysql2, bcrypt, cors, dotenv

---

## ⚙️ Installation and Usage

### 1. Clone Repository
`bash
git clone https://github.com/username/makebar-react.git
cd makebar-react`

### 2. Running
Terminal 1 Backend (Development)
`cd backend ||
npm run dev`
Terminal 2 Frontend (Development)
`cd makebar ||
npm run dev`

Terminal 1 Backend (Production)
`cd backend ||
npm run prod`
Terminal 2 Frontend (Production)
`cd makebar ||
npm run prod`

📜 License
MIT License © 2025 Zarhan
