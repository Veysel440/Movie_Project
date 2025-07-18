import oracledb from "oracledb";

export default async function handler(req, res) {
  const { page = 1, limit = 25 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: process.env.ORACLE_CONNECTION_STRING,
    });

    const result = await connection.execute(
      `
      SELECT * FROM (
        SELECT m.*, ROWNUM rnum FROM (
          SELECT link, title, poster FROM movies ORDER BY release_date DESC
        ) m WHERE ROWNUM <= :max
      ) WHERE rnum > :min
      `,
      {
        max: offset + parseInt(limit),
        min: offset,
      }
    );

    const countResult = await connection.execute(`SELECT COUNT(*) FROM movies`);
    const totalCount = countResult.rows[0][0];

    await connection.close();

    res.status(200).json({
      status: "success",
      movies: result.rows.map(([link, title, poster]) => ({
        link,
        title,
        poster,
      })),
      total: totalCount,
    });
  } catch (error) {
    console.error("API Hatası:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}
