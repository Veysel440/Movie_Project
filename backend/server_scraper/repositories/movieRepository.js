const { logErrorToDB } = require("../services/loggerService");

exports.exists = async (link, connection) => {
  try {
    const result = await connection.execute(
      `SELECT COUNT(*) FROM movies WHERE link = :link`,
      { link }
    );
    return result.rows[0][0] > 0;
  } catch (error) {
    console.error("Movie exists kontrol hatası:", error.message);
    await logErrorToDB(
      "movieRepository.exists",
      error.message,
      error.stack,
      "mid"
    );
    return false;
  }
};

exports.insert = async (movie, connection) => {
  const sql = `
    INSERT INTO movies (
      link, title, poster, description, imdb_rating,
      tmdb_rating, release_date, duration, country, slogan
    ) VALUES (
      :link, :title, :poster, :description, :imdbRating,
      :tmdbRating, :releaseDate, :duration, :country, :slogan
    )
  `;
  try {
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
  } catch (error) {
    console.error(`Movie ekleme hatası (${movie.link}):`, error.message);
    await logErrorToDB(
      "movieRepository.insert",
      error.message,
      error.stack,
      "high"
    );
    throw error;
  }
};
