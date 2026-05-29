const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Auth/auth.controller");
const {
  getGroup,
  addAlgorithmToGroup,
  removeAlgorithmFromGroup,
} = require("./group.controller");

// Get all algorithms in a group
router.get("/group/:groupName", authMiddleware, getGroup);
// Add an algorithm to a group
router.post("/group/:groupName", authMiddleware, addAlgorithmToGroup);
// Remove an algorithm from a group
router.delete(
  "/group/:groupName/:algoId",
  authMiddleware,
  removeAlgorithmFromGroup,
);

module.exports = router;
