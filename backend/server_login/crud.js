const { getConnection, oracledb } = require("./db");
const bcrypt = require("bcrypt");
const { logErrorToDB } = require("./services/loggerService");

async function handleLogin(email, password) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT PASSWORD, USER_TYPE FROM "USERS" WHERE "EMAIL" = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const { PASSWORD, USER_TYPE } = result.rows[0];
    const match = await bcrypt.compare(password, PASSWORD);

    if (!match) {
      throw new Error("Geçersiz şifre");
    }

    return { email, userType: USER_TYPE };
  } catch (error) {
    console.error("❌ Login Hatası:", error.message);
    await logErrorToDB("handleLogin", error.message, error.stack, "mid");
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("❌ Bağlantı kapatılırken hata:", closeErr.message);
        await logErrorToDB(
          "handleLogin_connectionClose",
          closeErr.message,
          closeErr.stack,
          "low"
        );
      }
    }
  }
}

module.exports = { handleLogin };
