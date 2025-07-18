const oracledb = require("oracledb");
const { db: dbConfig } = require("./config");

let pool;

async function initializePool() {
  if (!pool) {
    pool = await oracledb.createPool(dbConfig);
    console.log("DB connection pool initialized");
  }
  return pool;
}

async function getConnection() {
  if (!pool) await initializePool();
  return pool.getConnection();
}

module.exports = { initializePool, getConnection };
