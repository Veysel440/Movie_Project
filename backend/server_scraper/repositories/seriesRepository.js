const { logErrorToDB } = require("../services/loggerService");

exports.exists = async (link, connection) => {
  try {
    const result = await connection.execute(
      `SELECT COUNT(*) FROM series WHERE link = :link`,
      { link }
    );
    return result.rows[0][0] > 0;
  } catch (error) {
    console.error("Series exists kontrol hatası:", error.message);
    await logErrorToDB(
      "seriesRepository.exists",
      error.message,
      error.stack,
      "high"
    );
    return false;
  }
};

exports.insert = async (series, connection) => {
  const sql = `
    INSERT INTO series (
      link, title, poster, description, first_air_date,
      last_air_date, seasons, episodes, episode_duration, tmdb_rating
    ) VALUES (
      :link, :title, :poster, :description, :firstAirDate,
      :lastAirDate, :seasons, :episodes, :episodeDuration, :tmdbRating
    )
  `;
  try {
    await connection.execute(
      sql,
      {
        link: series.link,
        title: series.title,
        poster: series.poster,
        description: series.description,
        firstAirDate: series.first_air_date,
        lastAirDate: series.last_air_date,
        seasons: series.seasons,
        episodes: series.episodes,
        episodeDuration: series.episode_duration,
        tmdbRating: series.tmdbRating,
      },
      { autoCommit: true }
    );
  } catch (error) {
    console.error(`Series ekleme hatası (${series.link}):`, error.message);
    await logErrorToDB(
      "seriesRepository.insert",
      error.message,
      error.stack,
      "high"
    );
    throw error;
  }
};
