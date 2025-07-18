import oracledb from "oracledb";

export default async function handler(req, res) {
  const { link } = req.query;

  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: process.env.ORACLE_CONNECTION_STRING,
    });

    const result = await connection.execute(
      `
        SELECT m.link, m.title, m.poster, m.description, m.release_date, m.imdb_rating, m.tmdb_rating, 
               m.country, m.duration,
               (SELECT LISTAGG(g.genre, ', ') WITHIN GROUP (ORDER BY g.genre) 
                FROM movie_genres g 
                WHERE g.movie_link = m.link) as genres,
               (SELECT LISTAGG(a.actor_name || ' as ' || a.character_name || ' || ' || a.actor_photo, ', ') 
                WITHIN GROUP (ORDER BY a.actor_name) 
                FROM movie_actors a 
                WHERE a.movie_link = m.link) as actors
        FROM movies m
        WHERE m.link = :link
      `,
      [link]
    );

    if (result.rows.length === 0) {
      await connection.close();
      return res
        .status(404)
        .json({ status: "error", message: "Film bulunamadı" });
    }

    const [
      linkValue,
      title,
      poster,
      description,
      release_date,
      imdb_rating,
      tmdb_rating,
      country,
      duration,
      genres,
      actors,
    ] = result.rows[0];

    const movie = {
      link: linkValue,
      title,
      poster,
      description,
      release_date,
      imdb_rating,
      tmdb_rating,
      country,
      duration,
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
      `
  SELECT email, "COMMENT_TEXT", rating
  FROM movie_ratings_comments
  WHERE link = :link
  ORDER BY created_at DESC
  `,
      [link],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const comments = commentsResult.rows;

    const avgResult = await connection.execute(
      `
      SELECT 
        ROUND(AVG(rating), 1) AS avg_rating,
        COUNT(*) AS rating_count
      FROM movie_ratings_comments
      WHERE link = :link
      `,
      [link],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const avg_rating = avgResult.rows[0]?.AVG_RATING || 0;
    const rating_count = avgResult.rows[0]?.RATING_COUNT || 0;

    await connection.close();

    res.status(200).json({
      status: "success",
      movie,
      genres: genresArray,
      actors: actorsArray,
      comments,
      avg_rating,
      rating_count,
    });
  } catch (error) {
    console.error("DB Hatası:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}
