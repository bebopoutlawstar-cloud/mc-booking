require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("./models/Service");
const services = require("./data/services");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Service.deleteMany({});
    const created = await Service.insertMany(services);
    console.log(`Seeded ${created.length} services`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();