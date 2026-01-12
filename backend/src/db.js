const mysql = require("mysql2/promise");
require("dotenv").config();

const configuredPort = Number(process.env.DB_PORT);
const port = Number.isInteger(configuredPort) && configuredPort > 0 ? configuredPort : 3306;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 seconds
  ssl: {
    rejectUnauthorized: false
  },
  // Addition: Auto-reconnect settings
  connectTimeout: 10000, 
});

// Wrapper to handle the "PROTOCOL_CONNECTION_LOST" at the pool level
pool.on('connection', (connection) => {
  console.log('New connection established with ID:', connection.threadId);
  
  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed by the server. Reconnecting...');
    } else {
      throw err;
    }
  });
});

// Initial Connection Test
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    // On Render/Railway, sometimes the first attempt fails while the DB wakes up
    console.log("Retrying connection in 5 seconds...");
    setTimeout(testConnection, 5000);
  }
};

testConnection();

module.exports = pool;
