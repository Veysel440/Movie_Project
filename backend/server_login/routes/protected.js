const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, (req, res) => {
  res.json({
    success: true,
    message: "Gizli alana hoş geldiniz",
    user: req.user,
  });
});

module.exports = router;
