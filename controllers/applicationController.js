const Application = require("../models/Application");

exports.applyJob = async (req, res) => {

  try {

    const newApplication = new Application(req.body);

    await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully"
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};