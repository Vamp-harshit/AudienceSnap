const pool = require("../db");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;  // <-- fix here

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    // rest of your queries unchanged
    const [clicksPerLink] = await pool.execute(
      `SELECT l.id, l.title, COUNT(c.id) AS clicks
       FROM links l
       LEFT JOIN clicks c ON l.id = c.link_id
       WHERE l.user_id = ?
       GROUP BY l.id, l.title
       ORDER BY clicks DESC`,
      [userId]
    );

    const [totalClicksData] = await pool.execute(
      `SELECT COUNT(c.id) AS total_clicks
       FROM links l
       LEFT JOIN clicks c ON l.id = c.link_id
       WHERE l.user_id = ?`,
      [userId]
    );
    const totalClicks = totalClicksData[0]?.total_clicks || 0;

    const [clicksOverTime] = await pool.execute(
      `SELECT DATE(c.clicked_at) AS date, COUNT(c.id) AS clicks
       FROM clicks c
       JOIN links l ON c.link_id = l.id
       WHERE l.user_id = ? AND c.clicked_at >= CURDATE() - INTERVAL 30 DAY
       GROUP BY DATE(c.clicked_at)
       ORDER BY date ASC`,
      [userId]
    );

    const [activeLinks] = await pool.execute(
      `SELECT COUNT(*) AS active_links
       FROM links
       WHERE user_id = ? AND is_active = 1`,
      [userId]
    );

    res.json({
      clicksPerLink,
      totalClicks,
      clicksOverTime,
      activeLinks: activeLinks[0]?.active_links || 0,
    });
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
