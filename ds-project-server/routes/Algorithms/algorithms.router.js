const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Auth/auth.controller");
const {
  getAlgorithmById,
  updateAlgorithmById,
  getAllAlgorithms,
  createAlgorithm,
} = require("./algorithms.controller");

router.get("/algorithms/:algoId", authMiddleware, getAlgorithmById);
router.put("/algorithms/:algoId", authMiddleware, updateAlgorithmById);
router.get("/algorithms", authMiddleware, getAllAlgorithms);
router.post("/algorithms", createAlgorithm);

module.exports = router;
