# 🍹 Makebar React & Express Backend

Aplikasi full‑stack untuk sistem pemesanan makanan/minuman sederhana.  
Frontend dibuat dengan **React Native (Expo)**, sedangkan backend menggunakan **Express.js + MySQL** (hosted di WispByte).

---

## ✨ Fitur Utama
- **Autentikasi User & Penjual**
  - Register & Login dengan hashing password (bcrypt).
  - Role‑based: `user` dan `penjual`.

- **Manajemen Menu**
  - Penjual dapat menambahkan, mengedit, dan menghapus menu.
  - User dapat melihat daftar menu dari penjual.

- **Keranjang & Pesanan**
  - User dapat menambahkan menu ke keranjang.
  - Checkout pesanan → tersimpan di database.
  - Riwayat pesanan untuk user.
  - Pesanan masuk untuk penjual.

- **Order Management**
  - Update status pesanan (`pending`, `confirmed`, `completed`, `cancelled`).

---

## 🛠️ Teknologi
- **Frontend:** React Native (Expo), TypeScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL (WispByte)
- **Library utama:**
  - `mysql2` → koneksi database
  - `bcrypt` → hashing password
  - `cors` → akses API lintas origin
  - `dotenv` → konfigurasi environment

---

## ⚙️ Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/username/makebar-react.git
cd makebar-react
