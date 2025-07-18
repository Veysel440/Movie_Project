const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", auth, (req, res) =>
  res.json({
    success: true,
    message: "Profil erişimi başarılı",
    user: req.user,
  })
);

module.exports = router;
