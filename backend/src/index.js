const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const analyticsRoutes = require("./routes/analytics");
const linksRoutes = require("./routes/links");
const publicRoutes = require("./routes/public");
const clickRoutes = require("./routes/clicks");

const app = express();

app.use(cors({
  origin: "https://audiencesnap.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/links", linksRoutes);
app.use("/u", publicRoutes);
app.use("/click", clickRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
