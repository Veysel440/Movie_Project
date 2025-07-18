import memoize from "lodash/memoize";

const tableConfig = {
  MOVIES: {
    columns: [
      "link",
      "title",
      "poster",
      "description",
      "imdb_rating",
      "tmdb_rating",
      "release_date",
      "duration",
      "country",
      "slogan",
    ],
    idKey: "LINK",
    defaultValues: {
      imdb_rating: "0.0",
      tmdb_rating: "0.0",
      release_date: new Date().toISOString().split("T")[0],
    },
    validationRules: {
      link: (v) => ({ isValid: !!v, message: "Link boş bırakılamaz." }),
      title: (v) => ({ isValid: !!v, message: "Başlık boş bırakılamaz." }),
      imdb_rating: (v) => ({
        isValid: !isNaN(+v) && +v >= 0 && +v <= 10,
        message: "IMDb puanı 0-10 arasında olmalı.",
      }),
    },
  },

  USERS: {
    columns: [
      "email",
      "name",
      "surname",
      "password",
      "user_type",
      "created_at",
    ],
    idKey: "EMAIL",
    defaultValues: {
      user_type: "user",
      created_at: new Date().toISOString(),
    },
    validationRules: {
      email: (v) => ({
        isValid: !!v && v.includes("@"),
        message: "Geçerli bir e-posta adresi girin.",
      }),
      password: (v) => ({
        isValid: v.length >= 6,
        message: "Parola en az 6 karakter olmalı.",
      }),
    },
  },

  SERIES: {
    columns: [
      "link",
      "title",
      "poster",
      "description",
      "tmdb_rating",
      "first_air_date",
      "last_air_date",
      "seasons",
      "episodes",
      "episode_duration",
    ],
    idKey: "ID",
    defaultValues: {
      tmdb_rating: "0.0",
      first_air_date: new Date().toISOString().split("T")[0],
    },
    validationRules: {
      link: (v) => ({ isValid: !!v, message: "Link boş bırakılamaz." }),
      title: (v) => ({ isValid: !!v, message: "Başlık boş bırakılamaz." }),
    },
  },

  MOVIE_ACTORS: {
    columns: ["movie_link", "actor_name", "character_name", "actor_photo"],
    idKey: ["MOVIE_LINK", "ACTOR_NAME"],
    defaultValues: {},
    validationRules: {
      movie_link: (v) => ({
        isValid: !!v,
        message: "Film linki boş bırakılamaz.",
      }),
      actor_name: (v) => ({
        isValid: !!v,
        message: "Oyuncu adı boş bırakılamaz.",
      }),
    },
  },

  MOVIE_GENRES: {
    columns: ["movie_link", "genre"],
    idKey: ["MOVIE_LINK", "GENRE"],
    defaultValues: {},
    validationRules: {
      movie_link: (v) => ({
        isValid: !!v,
        message: "Film linki boş bırakılamaz.",
      }),
      genre: (v) => ({ isValid: !!v, message: "Tür boş bırakılamaz." }),
    },
  },

  MOVIE_RATINGS_COMMENTS: {
    columns: ["link", "email", "comment", "rating", "created_at"],
    idKey: ["LINK", "EMAIL"],
    defaultValues: {
      rating: "0",
      created_at: new Date().toISOString(),
    },
    validationRules: {
      link: (v) => ({ isValid: !!v, message: "Link boş bırakılamaz." }),
      email: (v) => ({
        isValid: !!v && v.includes("@"),
        message: "Geçerli bir e-posta adresi girin.",
      }),
      rating: (v) => ({
        isValid: !isNaN(+v) && +v >= 0 && +v <= 10,
        message: "Puan 0-10 arasında olmalı.",
      }),
    },
  },

  SERIES_RATINGS_COMMENTS: {
    columns: ["link", "email", "comment", "rating", "created_at"],
    idKey: ["LINK", "EMAIL"],
    defaultValues: {
      rating: "0",
      created_at: new Date().toISOString(),
    },
    validationRules: {
      link: (v) => ({ isValid: !!v, message: "Link boş bırakılamaz." }),
      email: (v) => ({
        isValid: !!v && v.includes("@"),
        message: "Geçerli bir e-posta adresi girin.",
      }),
      rating: (v) => ({
        isValid: !isNaN(+v) && +v >= 0 && +v <= 10,
        message: "Puan 0-10 arasında olmalı.",
      }),
    },
  },

  SERIES_ACTORS: {
    columns: ["series_link", "actor_name", "character_name", "actor_photo"],
    idKey: ["SERIES_LINK", "ACTOR_NAME"],
    defaultValues: {},
    validationRules: {
      series_link: (v) => ({
        isValid: !!v,
        message: "Dizi linki boş bırakılamaz.",
      }),
      actor_name: (v) => ({
        isValid: !!v,
        message: "Oyuncu adı boş bırakılamaz.",
      }),
    },
  },

  SERIES_GENRES: {
    columns: ["series_link", "genre"],
    idKey: ["SERIES_LINK", "GENRE"],
    defaultValues: {},
    validationRules: {
      series_link: (v) => ({
        isValid: !!v,
        message: "Dizi linki boş bırakılamaz.",
      }),
      genre: (v) => ({ isValid: !!v, message: "Tür boş bırakılamaz." }),
    },
  },
};

export const getTableColumns = (table) =>
  tableConfig[table]?.columns || tableConfig.MOVIES.columns;

export const getIdKey = (table) => tableConfig[table]?.idKey || "ID";

export const normalizeData = memoize(
  (data, table) => {
    const columns = getTableColumns(table);
    const defaults = tableConfig[table]?.defaultValues || {};
    const normalized = {};

    columns.forEach((col) => {
      const lower = col.toLowerCase();
      const upper = col.toUpperCase();
      normalized[upper] = data[lower] ?? data[upper] ?? defaults[lower] ?? "";
    });

    return normalized;
  },
  (data, table) => JSON.stringify({ data, table })
);

export const validateData = (data, table) => {
  const rules = tableConfig[table]?.validationRules || {};
  const columns = getTableColumns(table);

  for (const col of columns) {
    const lower = col.toLowerCase();
    const upper = col.toUpperCase();
    const rule = rules[lower];
    const value = data[lower] ?? data[upper] ?? "";

    if (rule) {
      const result = rule(value);
      if (!result.isValid) {
        return { isValid: false, message: result.message };
      }
    }
  }

  return { isValid: true, message: "" };
};
