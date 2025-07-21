exports.exists = async (link, connection) => {
  const result = await connection.execute(
    `SELECT COUNT(*) FROM series WHERE link = :link`,
    { link }
  );
  return result.rows[0][0] > 0;
};

exports.insert = async (series, connection) => {
  const sql = `
    INSERT INTO series (
      link,
      title,
      poster,
      description,
      first_air_date,
      last_air_date,
      seasons,
      episodes,
      episode_duration,
      tmdb_rating
    ) VALUES (
      :link,
      :title,
      :poster,
      :description,
      :firstAirDate,
      :lastAirDate,
      :seasons,
      :episodes,
      :episodeDuration,
      :tmdbRating
    )
  `;

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
};
