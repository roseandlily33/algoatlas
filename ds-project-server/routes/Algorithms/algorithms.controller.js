const { Algorithm } = require("../../models/DS.js");

// Get a single algorithm by ID
async function getAlgorithmById(req, res) {
  try {
    const { algoId } = req.params;
    const algo = await Algorithm.findById(algoId);
    if (!algo) return res.status(404).json({ error: "Algorithm not found" });
    return res.status(200).json(algo);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Update a single algorithm by ID (admin only)
async function updateAlgorithmById(req, res) {
  try {
    // TODO: Add admin check here if needed
    const { algoId } = req.params;
    const {
      title,
      description,
      solution,
      type,
      techniques,
      leetcodeNumber,
      examples,
      theory,
    } = req.body;
    const algo = await Algorithm.findByIdAndUpdate(
      algoId,
      {
        title,
        description,
        solution,
        type,
        techniques,
        leetcodeNumber,
        examples,
        theory,
      },
      { new: true }
    );
    console.log("Algorithm updated:", algo);
    if (!algo) return res.status(404).json({ error: "Algorithm not found" });
    return res.status(200).json(algo);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// Get all algorithms
async function getAllAlgorithms(req, res) {
  try {
    const algorithms = await Algorithm.find();
    console.log("Algorithms fetched:", algorithms.length);
    return res.status(200).json(algorithms);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Create a new algorithm (admin only)
async function createAlgorithm(req, res) {
  try {
    // TODO: Add admin check here if needed
    const {
      title,
      description,
      solution,
      type,
      techniques,
      leetcodeNumber,
      examples,
      theory,
    } = req.body;
    const algo = new Algorithm({
      title,
      description,
      solution,
      type,
      techniques,
      leetcodeNumber,
      examples,
      theory,
    });
    await algo.save();
    console.log("Algorithm created:", algo);
    return res.status(201).json(algo);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getAlgorithmById,
  updateAlgorithmById,
  getAllAlgorithms,
  createAlgorithm,
};
