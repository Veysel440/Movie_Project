const express = require("express");
const authRouter = require("./auth");
const protectedRouter = require("./protected");
const profileRouter = require("./profile");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/protected", protectedRouter);
router.use("/profile", profileRouter);

module.exports = router;
