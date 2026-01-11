const { v4: uuidv4 } = require("uuid");
const pool = require("../db"); // MySQL pool

// =======================
// CREATE LINK
// =======================
exports.createLink = async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const linkId = uuidv4();

    await pool.execute(
      "INSERT INTO links (id, user_id, title, url) VALUES (?, ?, ?, ?)",
      [linkId, req.user.userId, title, url]
    );

    res.status(201).json({ message: "Link created" });
  } catch (err) {
    console.error("CREATE LINK ERROR:", err);
    res.status(500).json({ message: "Failed to create link" });
  }
};

// =======================
// GET LINKS
// =======================
exports.getLinks = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [rows] = await pool.execute(
      "SELECT id, title, url, order_index, is_active FROM links WHERE user_id = ? ORDER BY order_index ASC",
      [req.user.userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET LINKS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch links" });
  }
};

// =======================
// DELETE LINK
// =======================
exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [result] = await pool.execute(
      "DELETE FROM links WHERE id = ? AND user_id = ?",
      [id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Link not found or not allowed" });
    }

    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    console.error("DELETE LINK ERROR:", err);
    res.status(500).json({ message: "Failed to delete link" });
  }
};
