// repositories/movieRepository.js

exports.exists = async (link, connection) => {
  const result = await connection.execute(
    `SELECT COUNT(*) FROM movies WHERE link = :link`,
    { link }
  );
  return result.rows[0][0] > 0;
};

exports.insert = async (movie, connection) => {
  const sql = `
    INSERT INTO movies (
      link,
      title,
      poster,
      description,
      imdb_rating,
      tmdb_rating,
      release_date,
      duration,
      country,
      slogan
    ) VALUES (
      :link,
      :title,
      :poster,
      :description,
      :imdbRating,
      :tmdbRating,
      :releaseDate,
      :duration,
      :country,
      :slogan
    )
  `;

  await connection.execute(
    sql,
    {
      link: movie.link,
      title: movie.title,
      poster: movie.poster,
      description: movie.description,
      imdbRating: movie.imdbRating,
      tmdbRating: movie.tmdbRating,
      releaseDate: movie.releaseDate,
      duration: movie.duration,
      country: movie.country,
      slogan: movie.slogan,
    },
    { autoCommit: true }
  );
};
