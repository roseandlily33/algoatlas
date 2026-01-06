const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Auth/auth.controller");
const { getWeeklyFocus, updateWeeklyFocus } = require("./user.controller");

router.get("/user/weekly-focus", authMiddleware, getWeeklyFocus);
router.post("/user/weekly-focus", authMiddleware, updateWeeklyFocus);

module.exports = router;
