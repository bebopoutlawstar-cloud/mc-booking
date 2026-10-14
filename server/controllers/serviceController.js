const Service = require("../models/Service");

exports.getServices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const services = await Service.find(filter).sort({ name: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Could not load services" });
  }
};