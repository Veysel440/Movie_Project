const oracledb = require("oracledb");
const config = require("./config");

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
      throw error;
    }
  }
  return pool;
}

async function getConnection() {
  if (!pool) await initializePool();
  return pool.getConnection();
}

async function closePool() {
  if (pool) {
    try {
      await pool.close();
      logger?.info("Veritabanı havuzu kapatıldı");
    } catch (error) {
      logger?.error("Havuz kapatma hatası:", error);
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
