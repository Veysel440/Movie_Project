const oracledb = require("oracledb");
const config = require("./config");
const { logErrorToDB } = require("./services/loggerService");

const dbConfig = config.db;

let pool;
let logger;

function setLogger(winstonLogger) {
  logger = winstonLogger;
}

async function initializePool() {
  if (!pool) {
    try {
      pool = await oracledb.createPool(dbConfig);
      logger?.info("Veritabanı havuzu oluşturuldu");
    } catch (error) {
      logger?.error("DB Havuzu oluşturma hatası:", error);
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
    await logErrorToDB("getConnection", error.message, error.stack, "high");
    throw error;
  }
}

async function closePool() {
  if (pool) {
    try {
      await pool.close();
      logger?.info("Veritabanı havuzu kapatıldı");
    } catch (error) {
      logger?.error("Havuz kapatma hatası:", error);
      await logErrorToDB("closePool", error.message, error.stack, "mid");
    }
  }
}

module.exports = {
  getConnection,
  setLogger,
  initializePool,
  closePool,
  oracledb,
};
