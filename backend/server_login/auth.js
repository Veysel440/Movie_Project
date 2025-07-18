const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection } = require("./db");
const config = require("./config");

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "E-posta ve şifre zorunlu" });

    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT PASSWORD, USER_TYPE FROM "USERS" WHERE "EMAIL" = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await conn.release();

    if (result.rows.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Kullanıcı bulunamadı" });

    const { PASSWORD, USER_TYPE } = result.rows[0];
    if (!(await bcrypt.compare(password, PASSWORD)))
      return res
        .status(401)
        .json({ success: false, message: "Geçersiz şifre" });

    const payload = { email, userType: USER_TYPE };
    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .json({ success: true, message: "Giriş başarılı", user: payload });
  } catch (err) {
    next(err);
  }
}

function logoutUser(req, res) {
  res.clearCookie("token").json({ success: true, message: "Çıkış yapıldı" });
}

module.exports = { loginUser, logoutUser };
