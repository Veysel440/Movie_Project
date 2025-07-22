const jwt = require("jsonwebtoken");
const { jwt: jwtConfig, cookie: cookieConfig } = require("../config");
const { logErrorToDB } = require("../services/loggerService");

async function authMiddleware(req, res, next) {
  const token = req.cookies?.[cookieConfig.name];

  if (!token) {
    await logErrorToDB(
      "authMiddleware",
      "Token yok - yetkisiz giriş",
      { ip: req.ip, url: req.originalUrl },
      "mid"
    );
    return res
      .status(401)
      .json({ success: false, message: "Yetkisiz. Giriş yapın." });
  }

  try {
    req.user = jwt.verify(token, jwtConfig.secret);
    next();
  } catch (err) {
    console.error("Token doğrulama hatası:", err.message);

    await logErrorToDB(
      "authMiddleware",
      "Geçersiz token",
      { error: err.message, ip: req.ip, url: req.originalUrl },
      "high"
    );

    return res.status(401).json({ success: false, message: "Geçersiz token." });
  }
}

module.exports = authMiddleware;
