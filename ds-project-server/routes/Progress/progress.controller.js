// Get user progress for the past week, grouped by day, unique algorithms per day
async function getWeeklyProgress(req, res) {
  try {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6); // includes today

    // Find all progress in the last 7 days
    const progress = await UserProgress.find({
      user: req.userId,
      lastPracticed: { $gte: weekAgo, $lte: now },
    }).populate("algorithm");

    // Group by date (YYYY-MM-DD), and for each day, collect unique algorithms
    const progressByDay = {};
    for (const entry of progress) {
      const dateStr = entry.lastPracticed.toISOString().slice(0, 10);
      if (!progressByDay[dateStr]) progressByDay[dateStr] = new Map();
      const algoId = entry.algorithm?._id?.toString() || entry.algorithm + "";
      if (!progressByDay[dateStr].has(algoId)) {
        progressByDay[dateStr].set(algoId, entry.algorithm);
      }
    }

    // Convert maps to arrays for output
    const result = Object.entries(progressByDay).map(([date, algoMap]) => ({
      date,
      algorithms: Array.from(algoMap.values()),
    }));

    // Sort by date descending
    result.sort((a, b) => b.date.localeCompare(a.date));
    console.log('Weekly progress fetched for userId:', req.userId, result.length);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
const { UserProgress } = require("../../models/DS.js");

// Get user progress for a single algorithm (latest)
async function getProgressByAlgo(req, res) {
  try {
    const { algoId } = req.params;
    const progress = await UserProgress.findOne({
      user: req.userId,
      algorithm: algoId,
    }).sort({ lastPracticed: -1 });
    if (!progress) return res.status(404).json({ error: "Progress not found" });
    return res.status(200).json(progress);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Get all progress attempts for a user and algorithm (history)
async function getProgressHistory(req, res) {
  try {
    const { algoId } = req.params;
    const history = await UserProgress.find({
      user: req.userId,
      algorithm: algoId,
    }).sort({ lastPracticed: 1 });
    return res.status(200).json(history);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Get user progress for all algorithms
async function getAllProgress(req, res) {
  try {
    const progress = await UserProgress.find({ user: req.userId }).populate(
      "algorithm",
    );
    console.log(
      "User progress fetched for userId:",
      req.userId,
      progress.length,
    );
    return res.status(200).json(progress);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Update or create user progress for an algorithm (each POST creates a new attempt)
async function postProgress(req, res) {
  try {
    const {
      rank,
      notes,
      status,
      isStarred,
      attemptsToday,
      pattern,
      dataStructure,
      traversalOrTechnique,
      coreInvariant,
      baseCases,
      commonMistake,
    } = req.body;
    const { algoId } = req.params;
    const progress = new UserProgress({
      user: req.userId,
      algorithm: algoId,
      rank: rank ?? 0,
      notes: notes ?? "",
      status: status ?? "Reviewing",
      isStarred: isStarred ?? false,
      attemptsToday: attemptsToday ?? 0,
      lastPracticed: new Date(),
      pattern: pattern ?? "",
      dataStructure: dataStructure ?? "",
      traversalOrTechnique: traversalOrTechnique ?? "",
      coreInvariant: coreInvariant ?? "",
      baseCases: baseCases ?? "",
      commonMistake: commonMistake ?? "",
    });
    await progress.save();
    // console.log("User progress updated:", progress);
    res.json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Reset user progress for an algorithm
async function resetProgress(req, res) {
  try {
    const { algoId } = req.params;
    await UserProgress.deleteOne({ user: req.userId, algorithm: algoId });
    res.json({ message: "Progress reset" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// User statistics
async function getStats(req, res) {
  try {
    const progress = await UserProgress.find({ user: req.userId });
    const mastered = progress.filter((p) => p.status === "Mastered").length;
    const reviewing = progress.filter((p) => p.status === "Reviewing").length;
    const deepPractice = progress.filter(
      (p) => p.status === "Deep Practice",
    ).length;
    const avgRank = progress.length
      ? progress.reduce((sum, p) => sum + (p.rank || 0), 0) / progress.length
      : 0;
    res.json({
      total: progress.length,
      mastered,
      reviewing,
      deepPractice,
      avgRank: Number(avgRank.toFixed(2)),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getProgressByAlgo,
  getProgressHistory,
  getAllProgress,
  postProgress,
  resetProgress,
  getStats,
  getWeeklyProgress,
};
