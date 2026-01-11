const express = require("express");
const auth = require("../middleware/auth");
const {
  createLink,
  getLinks,
  deleteLink,
} = require("../controllers/linkController");

const router = express.Router();

// Create a new link
router.post("/", auth, createLink);

// Get all links for logged-in user
router.get("/", auth, getLinks);

// Delete a link by ID
router.delete("/:id", auth, deleteLink);

module.exports = router;
