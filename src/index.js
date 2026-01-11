const analyticsRoutes = require("./routes/analytics");
const cors = require("cors");
const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors({
  origin: "https://audiencesnap-r385.onrender.com", // your frontend URL
  credentials: true,                // if you send cookies (optional here)
}));

app.use(express.json());
app.use("/analytics", analyticsRoutes);
app.use("/analytics", require("./routes/analytics"));

app.use("/auth", authRoutes);
const linksRoutes = require("./routes/links");

app.use("/links", linksRoutes);
const publicRoutes = require("./routes/public");

app.use("/", publicRoutes);
const clickRoutes = require("./routes/clicks");

app.use("/", clickRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
