// server_login/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const oracledb = require("oracledb");
const { getConnection } = require("../db");
const { jwt: jwtConfig, cookie: cookieConfig } = require("../config");

async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "E-posta ve şifre gerekli." });

  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT PASSWORD, USER_TYPE FROM "USERS" WHERE "EMAIL" = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.release();

    if (result.rows.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Kullanıcı bulunamadı." });

    const { PASSWORD: hash, USER_TYPE: userType } = result.rows[0];
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Şifre hatalı." });

    const payload = { email, userType };
    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res
      .cookie(cookieConfig.name, token, {
        httpOnly: cookieConfig.httpOnly,
        sameSite: cookieConfig.sameSite,
        secure: cookieConfig.secure,
        maxAge: cookieConfig.maxAge,
      })
      .status(200)
      .json({ success: true, message: "Giriş başarılı", user: payload });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  res
    .clearCookie(cookieConfig.name)
    .json({ success: true, message: "Çıkış yapıldı." });
}

module.exports = { login, logout };
