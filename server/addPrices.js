require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("./models/Service");

// [name, priceMin, priceMax]: the ranges from the project doc
const prices = [
  ["Podcast Editing", 60, 150], ["Short Videos", 60, 150], ["Voice Acting", 60, 150],
  ["Singing Reel", 75, 150], ["Gameplay Editing", 75, 200], ["Acting Reel", 100, 250],
  ["Motion Graphics", 100, 300], ["Wedding Photo Editing", 100, 300], ["Fluff Piece", 150, 300],
  ["Movie Trailer", 150, 350], ["Video Game Trailer", 150, 350],
  ["Wedding Filming", 300, 600], ["Documentary", 300, 600], ["Movie Editing", 350, 600],
  ["Camera & Editing Advice", 60, 60],
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  for (const [name, priceMin, priceMax] of prices) {
    const r = await Service.updateOne({ name }, { priceMin, priceMax });
    console.log(r.matchedCount ? "Updated" : "NOT FOUND", name);
  }
  await mongoose.disconnect();
});