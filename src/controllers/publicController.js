const pool = require("../db");

exports.getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const [users] = await pool.execute(
      "SELECT id, username FROM users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    const [links] = await pool.execute(
      "SELECT id, title, url FROM links WHERE user_id = ? AND is_active = 1 ORDER BY order_index ASC",
      [user.id]
    );

    res.json({
      username: user.username,
      links
    });
  } catch (err) {
    console.error("PUBLIC PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};
