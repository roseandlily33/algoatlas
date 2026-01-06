const express = require("express");
const router = express.Router();

const authRouter = require("./Auth/auth.router");
const progressRouter = require("./Progress/progress.router");
const algorithmsRouter = require("./Algorithms/algorithms.router");
const userRouter = require("./User/user.router");

// Mount each router at its base path
router.use(authRouter);
router.use(progressRouter);
router.use(algorithmsRouter);
router.use(userRouter);

module.exports = router;
