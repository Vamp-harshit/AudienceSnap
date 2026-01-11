const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const pool = require("../db");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await pool.execute(
      "INSERT INTO users (id, email, password_hash, username) VALUES (?, ?, ?, ?)",
      [userId, email, hashedPassword, username]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// NEW: Get user info by userId
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.execute(
      "SELECT username, email FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ username: rows[0].username, email: rows[0].email });
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};