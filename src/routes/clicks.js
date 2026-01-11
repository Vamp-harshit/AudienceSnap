const express = require("express");
const { trackClick } = require("../controllers/clickController");

const router = express.Router();

router.get("/click/:linkId", trackClick);

module.exports = router;
