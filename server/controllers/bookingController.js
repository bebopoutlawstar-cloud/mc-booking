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

const getMyBookings = async (req, res) => {
  try {
    // 1. Find bookings where user matches req.user._id
    const bookings = await Booking.find({ user: req.user._id })
      // 2. .populate("service") so each booking shows the service name, not just an ID
      .populate("service")
      // 3. .sort({ dateTime: 1 }) so the soonest chat comes first
      .sort({ dateTime: 1 });

    // 4. Send them back with res.json(...)
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    // 1. Find the booking by the ID in the URL
    //    (hint: Booking.findById(req.params.id))
    //    If not found, send 404 "Booking not found"
const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // 2. Make sure it belongs to the logged-in user
    //    (hint: booking.user.toString() !== req.user._id.toString())
    //    If it's someone else's, send 403 "Not your booking"
const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: "Not your booking" });
    }
    // 3. If it's already "cancelled" or "declined", send 400 "Booking is already closed"
    if (booking.status === "cancelled" || booking.status === "declined") {
      return res.status(400).json({ message: "Booking is already closed" });
    }
    // 4. Set booking.status = "cancelled", then await booking.save()
    booking.status = "cancelled";
    await booking.save();

    // 5. Send it back with res.json(booking)
  res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    // 1. Booking.find() with no filter gets ALL bookings
    const bookings = await Booking.find()
      // 2. .populate("user", "name email") gets just the client's name and email
      .populate("user", "name email")
      // 3. .populate("service") as before
      .populate("service")
      // 4. .sort({ dateTime: 1 }), soonest first
      .sort({ dateTime: 1 });

    // 5. res.json(...)
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    // 1. Read the new status
    const { status } = req.body;

    // 2. Only allow confirmed or declined
    if (status !== "confirmed" && status !== "declined") {
      return res.status(400).json({ message: "Status must be confirmed or declined" });
    }

    // 3. Find the booking
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 4. Don't let the admin change a booking the client cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Client cancelled this booking" });
    }

    // 5. Update and save
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings, updateStatus };