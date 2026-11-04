const express = require("express");
const router = express.Router();

const { createBooking, getMyBookings, cancelBooking, getAllBookings, updateStatus } = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", protect, adminOnly, getAllBookings);
router.patch("/:id/status", protect, adminOnly, updateStatus);
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;