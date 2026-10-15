const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
  type: String,
  required: true,
  trim: true,
},
    category: {
      type: String,
      required: true,
      enum: [
        "Reels",
        "Short-form",
        "Trailers",
        "Gaming",
        "Promo",
        "Long-form",
        "Weddings",
        "Audio",
        "Design",
        "Consulting",
      ],
    },
    turnaround: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);