const { getConnection, oracledb } = require("./db");
const bcrypt = require("bcrypt");
const config = require("./config");
const { logErrorToDB } = require("./services/loggerService");

async function handleRegister(req) {
  let connection;
  try {
    connection = await getConnection();
    const { name, surname, email, password, userType } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt.saltRounds
    );

    const result = await connection.execute(
      `SELECT COUNT(*) AS count FROM "USERS" WHERE "EMAIL" = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows[0].COUNT > 0) {
      throw new Error("Bu e-posta zaten kayıtlı");
    }

    const insertSql = `
      INSERT INTO "USERS" ("EMAIL", "NAME", "SURNAME", "PASSWORD", "USER_TYPE")
      VALUES (:email, :name, :surname, :password, :userType)
    `;

    await connection.execute(
      insertSql,
      {
        email,
        name,
        surname,
        password: hashedPassword,
        userType,
      },
      { autoCommit: true }
    );

    return { email, userType };
  } catch (error) {
    await logErrorToDB("handleRegister", error.message, error.stack, "high");
    console.error("handleRegister Error:", error);
    throw error;
  } finally {
    if (connection) await connection.release();
  }
}

module.exports = { handleRegister };
