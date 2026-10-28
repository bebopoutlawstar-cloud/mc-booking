const Booking = require("../models/Booking");
const Service = require("../models/Service");

const createBooking = async (req, res) => {
  try {
    // 1. Pull the booking details from the request
    const { service, dateTime, package: pkg, brief, notes } = req.body;

    // 2. Service and time are required
    if (!service || !dateTime) {
      return res.status(400).json({ message: "Service and date/time are required" });
    }

    // 3. Make sure the service exists
    const found = await Service.findById(service);
    if (!found) {
      return res.status(404).json({ message: "Service not found" });
    }

    // 4. Make sure the time slot is free
    const taken = await Booking.findOne({ dateTime, status: { $in: ["pending", "confirmed"] } });
    if (taken) {
      return res.status(409).json({ message: "That time was just booked. Please pick another." });
    }

    // 5. Create the booking; the user comes from the token, not the request body
    const booking = await Booking.create({
      user: req.user._id,
      service,
      dateTime,
      package: pkg,
      brief,
      notes,
    });

    // 6. Send it back
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createBooking };