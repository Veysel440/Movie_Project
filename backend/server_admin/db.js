const oracledb = require("oracledb");

let pool;
let logger = console;

function setLogger(l) {
  logger = l;
}

async function initializePool() {
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
}

async function getConnection() {
  if (!pool) await initializePool();
  return pool.getConnection();
}

module.exports = { initializePool, getConnection, setLogger };
