const express = require("express");
const { handleRegister } = require("./crud");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("./config");
const { logErrorToDB } = require("./services/loggerService");

const router = express.Router();

router.post(
  "/register",
  [
    body("email").notEmpty().isEmail().withMessage("Geçerli bir e-posta girin"),
    body("name").notEmpty().withMessage("İsim zorunludur"),
    body("surname").notEmpty().withMessage("Soyisim zorunludur"),
    body("password")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Şifre en az 6 karakter olmalı"),
    body("userType")
      .isIn(["oyuncu", "yonetmen"])
      .withMessage("Geçerli bir kullanıcı türü seçin"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const message = errors.array()[0].msg;
        await logErrorToDB(
          "REGISTER_VALIDATION",
          message,
          errors.array(),
          "low"
        );
        return res.status(400).json({ success: false, error: message });
      }

      const userData = await handleRegister(req);

      const token = jwt.sign(
        { email: userData.email, userType: userData.userType },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: config.jwt.cookieMaxAge,
      });

      res.status(201).json({
        success: true,
        message: "Kayıt başarılı. Token cookie olarak bırakıldı.",
      });
    } catch (error) {
      await logErrorToDB(
        "REGISTER_HANDLER",
        error.message,
        error.stack,
        "high"
      );
      next(error);
    }
  }
);

module.exports = router;
