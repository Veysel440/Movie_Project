const movieRepository = require("../repositories/movieRepository");
const { insertGenres, insertActors } = require("../utils/helpers");
const { logErrorToDB } = require("../services/loggerService");

exports.handleMovie = async ($$, itemUrl, category, connection) => {
  try {
    const title = $$('div.custom_fields:contains("Orijinal İsmi") .valor')
      .text()
      .trim();

    if (!title) return null;

    const exists = await movieRepository.exists(itemUrl, connection);
    if (exists) return null;

    const movie = {
      link: itemUrl,
      title,
      poster: $$(".poster img").attr("src") || null,
      description: $$(".wp-content h4").text().trim() || null,
      imdbRating:
        $$('.custom_fields:contains("IMDb Rating") .valor #repimdb strong')
          .text()
          .trim() || null,
      tmdbRating:
        $$('.custom_fields:contains("TMDb Puanı") .valor #repimdb strong')
          .text()
          .trim() || null,
      releaseDate:
        $$('.custom_fields:contains("Yayınlanma Tarihi") .valor')
          .text()
          .trim() || null,
      duration:
        $$('.custom_fields:contains("Süre") .valor').text().trim() || null,
      country:
        $$('.custom_fields:contains("Ülke") .valor').text().trim() || null,
      slogan:
        $$('.custom_fields:contains("Slogan") .valor').text().trim() || null,
      genres: [category],
      actors:
        $$(".person")
          .map((i, el) => ({
            name: $$(el).find(".name a").text().trim(),
            character: $$(el).find(".caracter").text().trim(),
            photo: $$(el).find(".img img").attr("src") || null,
          }))
          .get() || [],
    };

    await movieRepository.insert(movie, connection);

    await insertGenres(
      movie.genres,
      movie.link,
      "movie_genres",
      "movie_link",
      connection
    );

    await insertActors(
      movie.actors,
      movie.link,
      "movie_actors",
      "movie_link",
      connection
    );

    console.log(`✔ Film eklendi: ${movie.title}`);
    return movie;
  } catch (error) {
    const errorMessage = `Film ekleme hatası (${itemUrl}): ${error.message}`;
    console.error(`❌ ${errorMessage}`);

    await logErrorToDB(
      "movieService.handleMovie",
      error.message,
      { itemUrl, category, stack: error.stack },
      "mid"
    );

    return null;
  }
};
