const { executeSQL } = require("../services/oracleService");
async function handleSeriesDetail(req, res) {
  const slug = decodeURIComponent(req.params.link).trim();
  const connection = await getConnection();
  try {
    const sRes = await connection.execute(
      `SELECT * FROM SERIES WHERE LINK LIKE '%' || :slug`,
      [slug],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!sRes.rows || sRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Dizi bulunamadı" });
    }

    const series = sRes.rows[0];

    const [actorsRes, genresRes, commentsRes] = await Promise.all([
      connection.execute(
        `SELECT * FROM SERIES_ACTORS WHERE SERIES_LINK = :link`,
        [series.LINK],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      connection.execute(
        `SELECT * FROM SERIES_GENRES WHERE SERIES_LINK = :link`,
        [series.LINK],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      connection.execute(
        `SELECT * FROM SERIES_RATINGS_COMMENTS WHERE LINK = :link`,
        [series.LINK],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
    ]);

    const actors = Array.isArray(actorsRes.rows) ? actorsRes.rows : [];
    const genres = Array.isArray(genresRes.rows)
      ? genresRes.rows.map((r) => r.GENRE)
      : [];
    const comments = Array.isArray(commentsRes.rows) ? commentsRes.rows : [];

    res.json({
      success: true,
      series,
      actors,
      genres,
      comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    await connection.close();
  }
}

module.exports = { handleSeriesDetail };
