const tableConfig = {
  MOVIES: {
    columns: [
      "LINK",
      "TITLE",
      "POSTER",
      "DESCRIPTION",
      "IMDB_RATING",
      "TMDB_RATING",
      "RELEASE_DATE",
      "DURATION",
      "COUNTRY",
      "SLOGAN",
    ],
    primaryKey: "LINK",
  },
  SERIES: {
    columns: [
      "ID",
      "LINK",
      "TITLE",
      "POSTER",
      "DESCRIPTION",
      "TMDB_RATING",
      "FIRST_AIR_DATE",
      "LAST_AIR_DATE",
      "SEASONS",
      "EPISODES",
      "EPISODE_DURATION",
    ],
    primaryKey: "ID",
  },
  USERS: {
    columns: [
      "EMAIL",
      "NAME",
      "SURNAME",
      "PASSWORD",
      "USER_TYPE",
      "CREATED_AT",
    ],
    primaryKey: "EMAIL",
  },
  MOVIE_ACTORS: {
    columns: ["MOVIE_LINK", "ACTOR_NAME", "CHARACTER_NAME", "ACTOR_PHOTO"],
    primaryKey: ["MOVIE_LINK", "ACTOR_NAME"],
  },
  MOVIE_GENRES: {
    columns: ["MOVIE_LINK", "GENRE"],
    primaryKey: ["MOVIE_LINK", "GENRE"],
  },
  MOVIE_RATINGS_COMMENTS: {
    columns: ["LINK", "EMAIL", "COMMENT", "RATING", "CREATED_AT"],
    primaryKey: ["LINK", "EMAIL"],
  },
  SERIES_ACTORS: {
    columns: ["SERIES_LINK", "ACTOR_NAME", "CHARACTER_NAME", "ACTOR_PHOTO"],
    primaryKey: ["SERIES_LINK", "ACTOR_NAME"],
  },
  SERIES_GENRES: {
    columns: ["SERIES_LINK", "GENRE"],
    primaryKey: ["SERIES_LINK", "GENRE"],
  },
  SERIES_RATINGS_COMMENTS: {
    columns: ["LINK", "EMAIL", "COMMENT", "RATING", "CREATED_AT"],
    primaryKey: ["LINK", "EMAIL"],
  },
};

module.exports = { tableConfig };
