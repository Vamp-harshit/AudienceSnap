const mysql = require("mysql2/promise");
require("dotenv").config();

const configuredPort = Number(process.env.DB_PORT);
const port = Number.isInteger(configuredPort) && configuredPort > 0 ? configuredPort : 3306;

if (configuredPort && configuredPort !== port) {
  console.warn(`DB_PORT value '${process.env.DB_PORT}' looks invalid — defaulting to ${port}`);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: port,
  waitForConnections: true,
  connectionLimit: 5,     // Lower limit is safer for Railway
  queueLimit: 0,
  enableKeepAlive: true,  // <--- THIS IS REQUIRED TO FIX YOUR ERROR
  keepAliveInitialDelay: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection immediately on startup
pool.getConnection()
  .then((conn) => {
    console.log("✅ Database connected successfully!");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

module.exports = pool;
