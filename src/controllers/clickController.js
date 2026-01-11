const pool = require("../db");
const { v4: uuidv4 } = require("uuid");

exports.trackClick = async (req, res) => {
  try {
    const { linkId } = req.params;

    const [rows] = await pool.execute(
      "SELECT url FROM links WHERE id = ? AND is_active = 1",
      [linkId]
    );

    if (rows.length === 0) {
      return res.status(404).send("Link not found");
    }

    await pool.execute(
      "INSERT INTO clicks (id, link_id) VALUES (?, ?)",
      [uuidv4(), linkId]
    );

    res.redirect(rows[0].url);
  } catch (err) {
    console.error("CLICK ERROR:", err);
    res.status(500).send("Click failed");
  }
};
