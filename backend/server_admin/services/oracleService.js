const oracledb = require("oracledb");
const { logErrorToDB } = require("../services/loggerService");

let pool;

async function initializePool() {
  try {
    if (pool) return;
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
    });
    console.log("Oracle bağlantı havuzu kuruldu.");
  } catch (err) {
    console.error("🔴 DB Havuzu Kurulum Hatası:", err);
    await logErrorToDB("initializePool", err.message, err.stack, "high");
    throw err;
  }
}

async function getConnection() {
  try {
    if (!pool) await initializePool();
    return pool.getConnection();
  } catch (err) {
    console.error("🔴 DB Bağlantı Hatası:", err);
    await logErrorToDB("getConnection", err.message, err.stack, "high");
    throw err;
  }
}

async function executeSQL(sql, params = []) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(sql, params, {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result;
  } catch (err) {
    console.error("🔴 SQL Çalıştırma Hatası:", err);
    await logErrorToDB("executeSQL", err.message, { sql, params }, "high");
    throw err;
  } finally {
    await connection.close();
  }
}

module.exports = {
  initializePool,
  getConnection,
  executeSQL,
};
