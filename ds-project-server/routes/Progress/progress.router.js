const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Auth/auth.controller");
const {
  getProgressByAlgo,
  getProgressHistory,
  getAllProgress,
  postProgress,
  resetProgress,
  getStats,
  getWeeklyProgress,
} = require("./progress.controller");

router.get("/progress/weekly", authMiddleware, getWeeklyProgress);
router.get("/progress/:algoId", authMiddleware, getProgressByAlgo);
router.get("/progress/:algoId/history", authMiddleware, getProgressHistory);
router.get("/progress", authMiddleware, getAllProgress);
router.post("/progress/:algoId", authMiddleware, postProgress);
router.post("/progress/:algoId/reset", authMiddleware, resetProgress);
router.get("/stats", authMiddleware, getStats);

module.exports = router;
