const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({
  path: process.env.NODE_ENV === "prod" ? ".env.production" : ".env.development"
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // tambahan

// Konfigurasi koneksi MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,          // sesuaikan dengan user MySQL kamu
  password: process.env.DB_PASSWORD,          // isi jika root punya password
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// // Tes koneksi
// db.connect((err) => {
//   if (err) {
//     console.error("❌ Gagal koneksi MySQL:", err.message);
//     process.exit(1);
//   } else {
//     console.log("✅ Terhubung ke WispByte");
//   }
// });

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password dan role wajib diisi" });
    }

    const hashed = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashed, role],
      (err) => {
        if (err) {
          console.error("MySQL Error:", err.sqlMessage);
          return res.status(500).json({ message: "Error registering user", error: err.sqlMessage });
        }
        res.json({ message: "User registered successfully as ", role, success: true });
      }
    );
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const match = await bcrypt.compare(password, results[0].password);
      if (match) {
        res.json({
          message: "Login successful",
          success: true,
          role: results[0].role,
          id: results[0].id, // kirim id user
          email: results[0].email,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
});

// endpoint tambah menu
app.post("/menu", (req, res) => {
  const { menu, harga, penjual_id } = req.body;
  if (!menu || !harga || !penjual_id) {
    return res.status(400).json({ message: "Menu, harga, dan penjual_id wajib diisi" });
  }

  db.query(
    "INSERT INTO menus (penjual_id, menu, harga) VALUES (?, ?, ?)",
    [penjual_id, menu, harga],
    (err) => {
      if (err) {
        console.error("MySQL Error:", err.sqlMessage);
        return res.status(500).json({ message: "Gagal menambahkan menu" });
      }
      res.json({ message: "Menu berhasil ditambahkan", success: true });
    }
  );
});

// Update menu
app.put("/menu/:id", (req, res) => {
  const { id } = req.params;
  const { menu, harga } = req.body;
  db.query(
    "UPDATE menus SET menu = ?, harga = ? WHERE id = ?",
    [menu, harga, id],
    (err) => {
      if (err) return res.status(500).json({ message: "Gagal update menu" });
      res.json({ message: "Menu berhasil diupdate", success: true });
    }
  );
});

// ambil menu untuk update
app.get("/menu/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM menus WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.json(results[0]); // kirim data menu tunggal
  });
});

// Delete menu
app.delete("/menu/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM menus WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal hapus menu" });
    res.json({ message: "Menu berhasil dihapus", success: true });
  });
});


// Ambil semua penjual
app.get("/penjuals", (req, res) => {
  db.query("SELECT id, email FROM users WHERE role = 'penjual'", (err, results) => {
    if (err) return res.status(500).json({ message: "Error mengambil penjual" });
    res.json(results);
  });
});

// Ambil menu berdasarkan penjualId
app.get("/menus/:penjualId", (req, res) => {
  const { penjualId } = req.params;
  db.query("SELECT id, menu, harga, penjual_id FROM menus WHERE penjual_id = ?", [penjualId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error mengambil menu" });
    res.json(results);
  });
});

// get profil penjual
app.get("/penjuals/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, email, role FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error menampilkan profil penjual"});
    if (results.length === 0) return res.status(404).json({ message: "Profil penjual tidak ditemukan" });
    res.json(results[0])
  })
});

// endpoint order
app.post("/checkout", (req, res) => {
  const { user_id, penjual_id, items } = req.body;
  if (!user_id || !penjual_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Data Checkout tidak lengkap" });
  }

  // Ambil email user dari tabel users
  db.query("SELECT email FROM users WHERE id = ?", [user_id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(500).json({ message: "Gagal ambil email user" });
    }
    const userEmail = rows[0].email;

    // Insert ke orders dengan email
    db.query(
      "INSERT INTO orders (user_id, penjual_id, user_email, status, checkout_at) VALUES (?, ?, ?, 'confirmed', NOW())",
      [user_id, penjual_id, userEmail],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error membuat order" });
        }
        const orderId = result.insertId;

        const values = items.map((it) => [
          orderId,
          it.menu_id,
          it.harga,
          it.quantity || 1,
        ]);

        db.query(
          "INSERT INTO order_items (order_id, menu_id, harga, quantity) VALUES ?",
          [values],
          (err2) => {
            if (err2) {
              return res.status(500).json({ message: "Gagal menyimpan pesanan" });
            }
            res.json({ success: true, message: "Checkout berhasil", order_id: orderId });
          }
        );
      }
    );
  });
});

// endpoint penjual ambil pesanan
app.get("/orders/penjual/:penjualId", (req, res) => {
  const { penjualId } = req.params;
  const sql = `
    SELECT o.id as order_id, o.user_id, u.email as user_email, o.status, o.checkout_at,
           oi.id as order_item_id, oi.quantity, oi.harga,
           m.id as menu_id, m.menu
    FROM orders o
    JOIN users u ON u.id = o.user_id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN menus m ON m.id = oi.menu_id
    WHERE o.penjual_id = ? AND o.status = 'confirmed'
    ORDER BY o.checkout_at DESC
  `;
  db.query(sql, [penjualId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil pesanan penjual" });

    const map = new Map();
    rows.forEach((r) => {
      if (!map.has(r.order_id)) {
        map.set(r.order_id, {
          order_id: r.order_id,
          user_id: r.user_id,
          user_email: r.user_email, // email user ikut tampil
          status: r.status,
          checkout_at: r.checkout_at,
          items: []
        });
      }
      map.get(r.order_id).items.push({
        order_item_id: r.order_item_id,
        menu_id: r.menu_id,
        menu: r.menu,
        harga: r.harga,
        quantity: r.quantity
      });
    });

    res.json(Array.from(map.values()));
  });
});

console.log("DB Host & Port:", process.env.DB_HOST, process.env.DB_PORT);
app.listen(3000, () => console.log(`Server running in ${process.env.NODE_ENV} mode`));