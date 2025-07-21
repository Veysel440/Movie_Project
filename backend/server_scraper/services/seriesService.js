const seriesRepository = require("../repositories/seriesRepository");
const { insertGenres, insertActors } = require("../utils/helpers");

exports.handleSeries = async ($$, itemUrl, category, connection) => {
  try {
    const title = $$('div.custom_fields:contains("Orijinal İsmi") .valor')
      .text()
      .trim();
    if (!title) return null;

    const exists = await seriesRepository.exists(itemUrl, connection);
    if (exists) return null;

    const series = {
      link: itemUrl, // Dizi sayfasının URL'si
      title, // Orijinal isim yukarıda zaten çekilmişti
      poster: $$(".poster img").attr("src") || null, // Poster görsel URL'si
      description: $$(".wp-content h4").text().trim() || null, // Kısa açıklama

      first_air_date:
        $$('.custom_fields:contains("First air date") .valor').text().trim() ||
        null,

      last_air_date:
        $$('.custom_fields:contains("Son yayın tarihi") .valor')
          .text()
          .trim() || null,

      seasons: (() => {
        const value = $$('.custom_fields:contains("Sezonlar") .valor')
          .text()
          .trim();
        return value ? parseInt(value) : null;
      })(),

      episodes: (() => {
        const value = $$('.custom_fields:contains("Bölümler") .valor')
          .text()
          .trim();
        return value ? parseInt(value) : null;
      })(),

      episode_duration:
        $$('.custom_fields:contains("Bölüm Süresi") .valor').text().trim() ||
        null,

      tmdbRating:
        $$('.custom_fields:contains("TMDb Puanı") .valor #repimdb strong')
          .text()
          .trim() || null,

      genres: [category], // Kategori üzerinden gelen tür bilgisi (ayrı tabloya kaydedilir)

      actors:
        $$(".person")
          .map((i, el) => ({
            name: $$(el).find(".name a").text().trim() || "Bilinmiyor",
            character: $$(el).find(".caracter").text().trim() || null,
            photo: $$(el).find(".img img").attr("src") || null,
          }))
          .get() || [],
    };

    await seriesRepository.insert(series, connection);

    await insertGenres(
      series.genres,
      series.link,
      "series_genres",
      "series_link",
      connection
    );

    await insertActors(
      series.actors,
      series.link,
      "series_actors",
      "series_link",
      connection
    );

    console.log(`✔ Dizi eklendi: ${series.title}`);
    return series;
  } catch (error) {
    console.error(`❌ Dizi ekleme hatası (${itemUrl}):`, error.message);
    return null;
  }
};
