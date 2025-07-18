import oracledb from "oracledb";

const DEFAULT_LIMIT = 25;
const POOL_CONFIG = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
};

let pool;

async function initializePool() {
  if (!pool) {
    pool = await oracledb.createPool(POOL_CONFIG);
  }
  return pool;
}

async function getConnection() {
  if (!pool) await initializePool();
  return pool.getConnection();
}

async function fetchSeriesData(connection, offset, limit) {
  const result = await connection.execute(
    `
      SELECT link, title, poster, (SELECT COUNT(*) FROM SERIES) as total
      FROM SERIES
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `,
    { offset, limit },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  return {
    series: result.rows.map((row) => ({
      link: row.LINK,
      title: row.TITLE,
      poster: row.POSTER,
    })),
    total: result.rows.length > 0 ? result.rows[0].TOTAL : 0,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ status: "error", message: "Yalnızca GET metoduna izin verilir" });
  }

  const { page = 1, limit = DEFAULT_LIMIT } = req.query;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  if (
    !process.env.ORACLE_USER ||
    !process.env.ORACLE_PASSWORD ||
    !process.env.ORACLE_CONNECTION_STRING
  ) {
    return res
      .status(500)
      .json({ status: "error", message: "DB yapılandırması eksik" });
  }

  let connection;
  try {
    connection = await getConnection();
    const { series, total } = await fetchSeriesData(connection, offset, limit);
    res.status(200).json({ status: "success", series, total });
  } catch (error) {
    console.error("DB Hatası:", error);
    res.status(500).json({
      status: "error",
      message: "Sunucu hatası, lütfen tekrar deneyin",
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Bağlantı kapatma hatası:", err);
      }
    }
  }
}
