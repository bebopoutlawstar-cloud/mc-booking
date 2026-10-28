const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // 1. user: who booked
    //    type: mongoose.Schema.Types.ObjectId, ref: "User", required
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // 2. service: what they're booking
    //    same as user, but ref: "Service"
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    // 3. dateTime: when the chat is
    //    type: Date, required
    dateTime: {
      type: Date,
      required: true
    },

      // 4. package
    package: {
      type: String,
      enum: ["standard", "quick cut"],
      default: "standard",
    },
    // 5. brief
    brief: {
      type: String,
    },
    // 6. status
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "cancelled"],
      default: "pending",
    },
    // 7. notes
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);