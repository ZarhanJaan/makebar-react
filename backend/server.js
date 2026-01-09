const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();

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
  db.query("SELECT id, menu, harga FROM menus WHERE penjual_id = ?", [penjualId], (err, results) => {
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
app.post("/order", (req, res) => {
  const { user_id, penjual_id, items } = req.body;
  if (!user_id || !penjual_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Data pesanan tidak lengkap" });
  }

  db.query(
    "INSERT INTO orders (user_id, penjual_id) VALUES (?, ?)",
    [user_id, penjual_id],
    (err, result) => {
      if (err) {
        console.error("Order Error:", err.sqlMessage);
        return res.status(500).json({ message: "Gagal membuat pesanan" });
      }
      const orderId = result.insertId;

      const values = items.map((it) => [
        orderId,
        it.id,
        it.harga,
        it.quantity || 1
      ]);

      db.query(
        "INSERT INTO order_items (order_id, menu_id, harga, quantity) VALUES ?",
        [values],
        (err2) => {
          if (err2) {
            console.error("Order Items Error:", err2.sqlMessage);
            return res.status(500).json({ message: "Gagal menyimpan item pesanan" })
          }
          res.json({ message: "Pesanan berhasil dibuat", order_id: orderId });
        }
      );
    }
  );
});

// USER: riwayat pesanan
app.get("/orders/user/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT o.id as order_id, o.status, o.created_at,
           oi.id as order_item_id, oi.quantity, oi.harga,
           m.id as menu_id, m.menu, m.penjual_id
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN menus m ON m.id = oi.menu_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC, oi.id ASC
  `;
  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil riwayat pesanan" });

    // Grouping per order
    const map = new Map();
    rows.forEach((r) => {
      if (!map.has(r.order_id)) {
        map.set(r.order_id, {
          order_id: r.order_id,
          status: r.status,
          created_at: r.created_at,
          items: []
        });
      }
      map.get(r.order_id).items.push({
        order_item_id: r.order_item_id,
        menu_id: r.menu_id,
        menu: r.menu,
        harga: r.harga,
        quantity: r.quantity,
        penjual_id: r.penjual_id
      });
    });
    res.json(Array.from(map.values()));
  });
});

// PENJUAL: Pesanan masuk
app.get("/orders/penjual/:penjualId", (req, res) => {
  const { penjualId } = req.params;
  const sql = `
    SELECT o.id as order_id, o.user_id, o.status, o.created_at,
           oi.id as order_item_id, oi.quantity, oi.harga,
           m.id as menu_id, m.menu
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN menus m ON m.id = oi.menu_id
    WHERE o.penjual_id = ?
    ORDER BY o.created_at DESC, oi.id ASC
  `;
  db.query(sql, [penjualId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil pesanan penjual" });

    const map = new Map();
    rows.forEach((r) => {
      if (!map.has(r.order_id)) {
        map.set(r.order_id, {
          order_id: r.order_id,
          user_id: r.user_id,
          status: r.status,
          created_at: r.created_at,
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

// Update status order (opsional)
app.put("/orders/:orderId/status", (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const allowed = ["pending", "confirmed", "completed", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Status tidak valid" });

  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId], (err) => {
    if (err) return res.status(500).json({ message: "Gagal update status" });
    res.json({ message: "Status pesanan diperbarui" });
  });
});


app.listen(3000, () => console.log("🚀 Server running on port 3000"));