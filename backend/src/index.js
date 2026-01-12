const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.get("/health", (req, res) => {
  res.status(200).send("Server is awake");
});
// Import Routes
const authRoutes = require("./routes/auth");
const analyticsRoutes = require("./routes/analytics");
const linksRoutes = require("./routes/links");
const publicRoutes = require("./routes/public");
const clickRoutes = require("./routes/clicks");


// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Route Middleware
app.use("/auth", authRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/links", linksRoutes);

// Root level routes
app.use("/", publicRoutes);
app.use("/", clickRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
