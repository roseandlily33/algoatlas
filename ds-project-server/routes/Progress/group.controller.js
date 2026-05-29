const { Group } = require("../../models/Group");
const { Algorithm } = require("../../models/DS");

// Get all algorithms in a group (A or B)
async function getGroup(req, res) {
  try {
    const { groupName } = req.params;
    if (!["A", "B"].includes(groupName)) {
      return res.status(400).json({ error: "Invalid group name" });
    }
    const group = await Group.findOne({ name: groupName }).populate(
      "algorithms",
    );
    console.log("Returning group", group?.length);
    if (!group) return res.status(404).json({ error: "Group not found" });
    return res.status(200).json(group);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Add an algorithm to a group (A or B)
async function addAlgorithmToGroup(req, res) {
  try {
    const { groupName } = req.params;
    const { algoId } = req.body;
    console.log("AlgoId", algoId, groupName);
    if (!["A", "B"].includes(groupName)) {
      return res.status(400).json({ error: "Invalid group name" });
    }
    let group = await Group.findOne({ name: groupName });
    console.log('Fonund group', group);
    if (!group) {
      group = new Group({ name: groupName, algorithms: [] });
    }
    if (group.algorithms.length >= 20) {
      return res.status(400).json({ error: "Group already has 20 algorithms" });
    }
    if (
      group.algorithms.map((id) => id.toString()).includes(algoId.toString())
    ) {
      return res.status(400).json({ error: "Algorithm already in group" });
    }
    // Check if algorithm exists
    console.log("Checking algoId:", algoId);
    const algo = await Algorithm.findById(algoId);
    console.log("Algorithm found:", algo.leetcodeNumber);
    if (!algo) {
      return res.status(400).json({ error: "Algorithm not found" });
    }
    group.algorithms.push(algoId);
    group.markModified("algorithms");
    console.log("Group Algs", group.algorithms);
    await group.save();
    return res.status(200).json(group);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Remove an algorithm from a group (A or B)
async function removeAlgorithmFromGroup(req, res) {
  try {
    const { groupName, algoId } = req.params;
    if (!["A", "B"].includes(groupName)) {
      return res.status(400).json({ error: "Invalid group name" });
    }
    const group = await Group.findOne({ name: groupName });
    if (!group) return res.status(404).json({ error: "Group not found" });
    group.algorithms = group.algorithms.filter(
      (id) => id.toString() !== algoId,
    );
    await group.save();
    return res.status(200).json(group);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getGroup,
  addAlgorithmToGroup,
  removeAlgorithmFromGroup,
};
