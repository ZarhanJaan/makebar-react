const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // tambahan

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",          // sesuaikan dengan user MySQL kamu
  password: "",          // isi jika root punya password
  database: "react_native_auth",
  port: 3306
});

// Tes koneksi
db.connect((err) => {
  if (err) {
    console.error("❌ Gagal koneksi MySQL:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Terhubung ke MySQL");
  }
});

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
        res.json({ message: "User registered successfully as ", role });
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
      res.json({ message: "Menu berhasil ditambahkan" });
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
      res.json({ message: "Menu berhasil diupdate" });
    }
  );
});

// Delete menu
app.delete("/menu/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM menus WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal hapus menu" });
    res.json({ message: "Menu berhasil dihapus" });
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


app.listen(3000, () => console.log("🚀 Server running on port 3000"));