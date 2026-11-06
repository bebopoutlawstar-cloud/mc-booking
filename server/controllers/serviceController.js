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

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};