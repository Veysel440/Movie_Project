const jwt = require("jsonwebtoken");
const { jwt: jwtConfig, cookie: cookieConfig } = require("../config");

function authMiddleware(req, res, next) {
  const token = req.cookies?.[cookieConfig.name];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Yetkisiz. Giriş yapın." });
  }
  try {
    req.user = jwt.verify(token, jwtConfig.secret);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Geçersiz token." });
  }
}

module.exports = authMiddleware;
