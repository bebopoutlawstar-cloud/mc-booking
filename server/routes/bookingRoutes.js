const express = require("express");
const router = express.Router();

const { createBooking, getMyBookings, cancelBooking, getAllBookings, updateStatus } = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/auth");

// Client routes
router.post("/", protect, createBooking);
router.get("/mine", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking);

// Admin routes
router.get("/", protect, adminOnly, getAllBookings);
router.patch("/:id/status", protect, adminOnly, updateStatus);

module.exports = router;