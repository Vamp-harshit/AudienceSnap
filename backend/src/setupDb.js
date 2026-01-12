const pool = require("./db");

async function createTables() {
  try {
    console.log("⏳ Creating tables...");

    // 1. Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users table checked/created.");

    // 2. Create Links Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS links (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        order_index INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Links table checked/created.");

    // 3. Create Clicks Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clicks (
        id VARCHAR(36) PRIMARY KEY,
        link_id VARCHAR(36) NOT NULL,
        clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Clicks table checked/created.");

    console.log("🎉 Database setup complete!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error creating tables:", err);
    process.exit(1);
  }
}

createTables();
