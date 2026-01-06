const express = require("express");
const router = express.Router();
const {
  createAccount,
  authMiddleware,
  getMe,
  login,
  logout,
} = require("./auth.controller");

router.post("/create-account", createAccount);
router.get("/me", authMiddleware, getMe);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
