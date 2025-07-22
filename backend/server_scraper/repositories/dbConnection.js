const oracledb = require("oracledb");
const dbConfig = require("../config/dbConfig");
const { logErrorToDB } = require("../services/loggerService");

exports.getConnection = async () => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("✅ Veritabanına bağlanıldı.");
    return connection;
  } catch (error) {
    console.error("❌ Veritabanı bağlantı hatası:", error.message);

    await logErrorToDB(
      "dbConnection.getConnection",
      error.message,
      error.stack,
      "high"
    );

    throw error;
  }
};
