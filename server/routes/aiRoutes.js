const express = require("express");
const router = express.Router();

const { createBrief } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.post("/brief", protect, createBrief);

module.exports = router;