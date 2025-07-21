const oracledb = require("oracledb");
const dbConfig = require("../config/dbConfig");

exports.getConnection = async () => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("✅ Veritabanına bağlanıldı.");
    return connection;
  } catch (error) {
    console.error("❌ Veritabanı bağlantı hatası:", error.message);
    throw error;
  }
};
