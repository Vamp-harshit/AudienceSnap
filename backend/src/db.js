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
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});
module.exports = pool;
