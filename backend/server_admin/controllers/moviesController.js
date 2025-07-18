const { executeSQL } = require("../services/oracleService");
async function handleMovieDetail(req, res) {
  const slug = decodeURIComponent(req.params.link).trim();
  const connection = await getConnection();
  try {
    const mRes = await connection.execute(
      `SELECT * FROM MOVIES WHERE LINK LIKE '%' || :slug`,
      [slug],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!mRes.rows || mRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Film bulunamadı" });
    }

    const movie = mRes.rows[0];

    const [actorsRes, genresRes, commentsRes] = await Promise.all([
      connection.execute(
        `SELECT * FROM MOVIE_ACTORS WHERE MOVIE_LINK = :link`,
        [movie.LINK],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      connection.execute(
        `SELECT * FROM MOVIE_GENRES WHERE MOVIE_LINK = :link`,
        [movie.LINK],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      connection.execute(
        `SELECT * FROM MOVIE_RATINGS_COMMENTS WHERE LINK = :link`,
        [movie.LINK],
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
      movie,
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

module.exports = { handleMovieDetail };
