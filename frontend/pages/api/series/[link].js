import oracledb from "oracledb";

export default async function handler(req, res) {
  const { link } = req.query;

  console.log(" API çağrısı: /api/series/[link]", link);

  if (!link) {
    return res
      .status(400)
      .json({ status: "error", message: "Link parametresi eksik" });
  }

  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: process.env.ORACLE_CONNECTION_STRING,
    });

    const result = await connection.execute(
      `
        SELECT s.link, s.title, s.poster, s.description, s.first_air_date, s.last_air_date,
               s.seasons, s.episodes, s.episode_duration, s.tmdb_rating,
               (SELECT LISTAGG(g.genre, ', ') WITHIN GROUP (ORDER BY g.genre) 
                FROM series_genres g WHERE g.series_link = s.link) AS genres,
               (SELECT LISTAGG(a.actor_name || ' as ' || a.character_name || ' || ' || a.actor_photo, ', ')
                WITHIN GROUP (ORDER BY a.actor_name)
                FROM series_actors a WHERE a.series_link = s.link) AS actors
        FROM series s
        WHERE s.link LIKE '%' || :link
      `,
      [link]
    );

    console.log("🔍 Satır sayısı:", result.rows.length);

    if (result.rows.length === 0) {
      await connection.close();
      return res
        .status(404)
        .json({ status: "error", message: "Dizi bulunamadı" });
    }

    const [
      linkValue,
      title,
      poster,
      description,
      first_air_date,
      last_air_date,
      seasons,
      episodes,
      episode_duration,
      tmdb_rating,
      genres,
      actors,
    ] = result.rows[0];

    const series = {
      link: linkValue,
      title,
      poster,
      description,
      first_air_date,
      last_air_date,
      seasons,
      episodes,
      episode_duration,
      tmdb_rating,
    };

    const genresArray = genres ? genres.split(", ") : [];

    const actorsArray = actors
      ? actors.split(", ").map((actor) => {
          const [namePart, photo] = actor.split(" || ");
          const [name, character] = namePart.split(" as ");
          return { name, character, photo };
        })
      : [];

    const commentsResult = await connection.execute(
      `SELECT EMAIL, "COMMENT_TEXT", RATING, CREATED_AT
       FROM SERIES_RATINGS_COMMENTS
       WHERE LINK = :link
       ORDER BY CREATED_AT DESC`,
      [link],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const comments = commentsResult.rows;

    const avgResult = await connection.execute(
      `SELECT ROUND(AVG(RATING), 1) AS avg_rating, COUNT(*) AS rating_count
       FROM SERIES_RATINGS_COMMENTS WHERE LINK = :link`,
      [link],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const avg_rating = avgResult.rows[0]?.AVG_RATING || 0;
    const rating_count = avgResult.rows[0]?.RATING_COUNT || 0;

    await connection.close();

    res.status(200).json({
      status: "success",
      series,
      genres: genresArray,
      actors: actorsArray,
      comments,
      avg_rating,
      rating_count,
    });
  } catch (err) {
    console.error(" DB Hata:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
}
