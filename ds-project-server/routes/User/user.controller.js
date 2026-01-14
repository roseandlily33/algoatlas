const User = require("../../models/User.js");

// Get weekly focus list and start date for current user
async function getWeeklyFocus(req, res) {
  console.log("Weekly Focus");
  try {
    console.log("Fetching weekly focus for userId:", req.userId);
    const user = await User.findById(req.userId).populate("weeklyFocus");
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("User weekly focus", user?.firstName);
    return res.status(200).json({
      weeklyFocus: user.weeklyFocus,
      weeklyFocusStartDate: user.weeklyFocusStartDate,
    });
  } catch (err) {
    console.log("Error fetching weekly focus:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// Update weekly focus list and/or start date for current user
async function updateWeeklyFocus(req, res) {
  try {
    const { weeklyFocus, weeklyFocusStartDate } = req.body;
    console.log(
      "Updating weekly focus for userId:",
      req.userId,
      // weeklyFocus,
      // weeklyFocusStartDate
    );
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (Array.isArray(weeklyFocus)) user.weeklyFocus = weeklyFocus;
    if (weeklyFocusStartDate) user.weeklyFocusStartDate = weeklyFocusStartDate;
    await user.save();
    res.json({
      weeklyFocus: user.weeklyFocus,
      weeklyFocusStartDate: user.weeklyFocusStartDate,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getWeeklyFocus,
  updateWeeklyFocus,
};
