const oracledb = require("oracledb");

let pool;

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
  console.log("Oracle bağlantı havuzu kuruldu.");
}

async function getConnection() {
  if (!pool) await initializePool();
  return pool.getConnection();
}

async function executeSQL(sql, params = []) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(sql, params, {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    return result;
  } finally {
    await connection.close();
  }
}

module.exports = {
  initializePool,
  getConnection,
  executeSQL,
};
