const express = require("express");
const { getPublicProfile } = require("../controllers/publicController");

const router = express.Router();

router.get("/u/:username", getPublicProfile);

module.exports = router;
