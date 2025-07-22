const oracledb = require("oracledb");
const { db: dbConfig } = require("./config");
const { logErrorToDB } = require("./services/loggerService");

let pool;

async function initializePool() {
  if (!pool) {
    try {
      pool = await oracledb.createPool(dbConfig);
      console.log("✅ DB connection pool initialized");
    } catch (error) {
      console.error("❌ DB Havuzu başlatılamadı:", error.message);
      await logErrorToDB("initializePool", error.message, error.stack, "high");
      throw error;
    }
  }
  return pool;
}

async function getConnection() {
  try {
    if (!pool) await initializePool();
    return pool.getConnection();
  } catch (error) {
    console.error("❌ DB Bağlantısı alınamadı:", error.message);
    await logErrorToDB("getConnection", error.message, error.stack, "high");
    throw error;
  }
}

module.exports = { initializePool, getConnection };
