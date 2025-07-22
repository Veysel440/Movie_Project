const oracledb = require("oracledb");
const { logErrorToDB } = require("./services/loggerService");

let pool;
let logger = console;

function setLogger(l) {
  logger = l;
}

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
    logger.info("DB havuzu hazır!");
  } catch (err) {
    logger.error("DB havuzu başlatılamadı", err);
    await logErrorToDB("initializePool", err.message, err.stack, "high");
    throw err;
  }
}

async function getConnection() {
  try {
    if (!pool) await initializePool();
    return pool.getConnection();
  } catch (err) {
    logger.error("DB bağlantısı alınamadı", err);
    await logErrorToDB("getConnection", err.message, err.stack, "high");
    throw err;
  }
}

module.exports = { initializePool, getConnection, setLogger };
