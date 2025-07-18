const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const oracledb = require("oracledb");

const app = express();
const port = 3000;

const categoryMap = {
  gerilim: "https://dizimag.eu/kategori/gerilim",
  komedi: "https://dizimag.eu/kategori/komedi",
  aksiyon: "https://dizimag.eu/kategori/aksiyon",
  macera: "https://dizimag.eu/kategori/macera",
  aile: "https://dizimag.eu/kategori/aile",
  animasyon: "https://dizimag.eu/kategori/animasyon",
  dram: "https://dizimag.eu/kategori/dram",
  romantik: "https://dizimag.eu/kategori/romantik",
  "bilim-kurgu-fantazi": "https://dizimag.eu/kategori/bilim-kurgu-fantazi",
  suç: "https://dizimag.eu/kategori/suc",
  tarih: "https://dizimag.eu/kategori/tarih",
  fantastik: "https://dizimag.eu/kategori/fantastik",
  "bilim-kurgu": "https://dizimag.eu/kategori/bilim-kurgu",
  gizem: "https://dizimag.eu/kategori/gizem",
  "aksiyon-macera": "https://dizimag.eu/kategori/aksiyon-macera",
};

const dbConfig = {
  user: "system",
  password: "Veysel.12",
  connectString: "localhost:1521/orcl2",
};

function getContentType(url) {
  if (url.includes("/belgesel/")) return "documentary";
  if (url.includes("/dizi/")) return "series";
  return "movie";
}

function getRandomCategory() {
  const allCategories = Object.keys(categoryMap);
  const shuffled = allCategories.sort(() => 0.5 - Math.random());
  return shuffled[0];
}

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

app.get("/scrape", async (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const usedLinks = new Set();
  const itemsData = [];
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log("Veritabanına bağlandı.");

    while (itemsData.length < count) {
      const randomCategory = getRandomCategory();
      const categoryUrl = categoryMap[randomCategory];
      console.log(`Kategori: ${randomCategory} (${categoryUrl})`);

      let { data } = await axios.get(categoryUrl, { headers });
      let $ = cheerio.load(data);
      let links = [];
      $(".item.movies a").each((_, el) => {
        const href = $(el).attr("href");
        if (href && !usedLinks.has(href)) {
          links.push(href);
        }
      });

      if (links.length === 0) {
        const { data } = await axios.get("https://dizimag.eu/dizi", {
          headers,
        });
        $ = cheerio.load(data);
        $("#archive-content .item.tvshows a").each((_, el) => {
          const href = $(el).attr("href");
          if (href && !usedLinks.has(href)) {
            links.push(href);
          }
        });
      }

      if (links.length === 0) {
        console.log(`Hiç yeni link bulunamadı: ${randomCategory}`);
        continue;
      }

      const randomIndex = Math.floor(Math.random() * links.length);
      const itemUrl = links[randomIndex];

      if (usedLinks.has(itemUrl)) {
        continue;
      }
      usedLinks.add(itemUrl);

      try {
        const { data: detailHtml } = await axios.get(itemUrl, { headers });
        const $$ = cheerio.load(detailHtml);

        const contentType = getContentType(itemUrl);

        if (contentType === "movie") {
          const movie = {
            link: itemUrl,
            title:
              $$('div.custom_fields:contains("Orijinal İsmi") .valor')
                .text()
                .trim() || "İsim bulunamadı",
            poster: $$(".poster img").attr("src") || "Poster yok",
            description: $$(".wp-content h4").text().trim() || "Açıklama yok",
            imdbRating:
              $$(
                '.custom_fields:contains("IMDb Rating") .valor #repimdb strong'
              )
                .text()
                .trim() || "IMDb yok",
            tmdbRating:
              $$('.custom_fields:contains("TMDb Puanı") .valor #repimdb strong')
                .text()
                .trim() || "TMDb yok",
            releaseDate:
              $$('.custom_fields:contains("Yayınlanma Tarihi") .valor')
                .text()
                .trim() || "Tarih yok",
            duration:
              $$('.custom_fields:contains("Süre") .valor').text().trim() ||
              "Süre yok",
            country:
              $$('.custom_fields:contains("Ülke") .valor').text().trim() ||
              "Ülke yok",
            slogan:
              $$('.custom_fields:contains("Slogan") .valor').text().trim() ||
              "Slogan yok",
            genres: [randomCategory],
            actors:
              $$(".person")
                .map((i, el) => ({
                  name: $$(el).find(".name a").text().trim(),
                  character: $$(el).find(".caracter").text().trim(),
                  photo: $$(el).find(".img img").attr("src") || "Foto yok",
                }))
                .get() || [],
          };

          const result = await connection.execute(
            `SELECT COUNT(*) FROM movies WHERE link = :link`,
            { link: movie.link }
          );
          const isExists = result.rows[0][0] > 0;
          if (isExists) {
            console.log(`Zaten var: ${movie.link}`);
            continue;
          }

          const sql = `
            INSERT INTO movies (
              link, title, poster, description, imdb_rating, tmdb_rating, release_date, duration, country, slogan
            ) VALUES (
              :link, :title, :poster, :description, :imdbRating, :tmdbRating, :releaseDate, :duration, :country, :slogan
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

          for (let genre of movie.genres) {
            const genreSql = `INSERT INTO movie_genres (movie_link, genre) VALUES (:link, :genre)`;
            await connection.execute(
              genreSql,
              { link: movie.link, genre },
              { autoCommit: true }
            );
          }

          for (let actor of movie.actors) {
            const actorSql = `
              INSERT INTO movie_actors (movie_link, actor_name, character_name, actor_photo)
              VALUES (:link, :actorName, :character, :photo)
            `;
            await connection.execute(
              actorSql,
              {
                link: movie.link,
                actorName: actor.name,
                character: actor.character,
                photo: actor.photo,
              },
              { autoCommit: true }
            );
          }

          itemsData.push(movie);
          console.log(`✔ Film eklendi: ${movie.title} (${randomCategory})`);
        } else if (contentType === "series") {
          const series = {
            link: itemUrl,
            title:
              $$('div.custom_fields:contains("Orijinal İsmi") .valor')
                .text()
                .trim() || "İsim bulunamadı",
            poster: $$(".poster img").attr("src") || "Poster yok",
            description: $$(".wp-content h4").text().trim() || "Açıklama yok",
            first_air_date:
              $$('.custom_fields:contains("First air date") .valor')
                .text()
                .trim() || null,
            last_air_date:
              $$('.custom_fields:contains("Son yayın tarihi") .valor')
                .text()
                .trim() || null,
            seasons:
              parseInt(
                $$('.custom_fields:contains("Sezonlar") .valor').text().trim()
              ) || null,
            episodes:
              parseInt(
                $$('.custom_fields:contains("Bölümler") .valor').text().trim()
              ) || null,
            episode_duration:
              $$('.custom_fields:contains("Bölüm Süresi") .valor')
                .text()
                .trim() || null,
            tmdbRating:
              $$('.custom_fields:contains("TMDb Puanı") .valor #repimdb strong')
                .text()
                .trim() || null,
            genres: [randomCategory],
            actors:
              $$(".person")
                .map((i, el) => ({
                  name: $$(el).find(".name a").text().trim(),
                  character: $$(el).find(".caracter").text().trim(),
                  photo: $$(el).find(".img img").attr("src") || "Foto yok",
                }))
                .get() || [],
          };

          const result = await connection.execute(
            `SELECT COUNT(*) FROM series WHERE link = :link`,
            { link: series.link }
          );
          const isExists = result.rows[0][0] > 0;
          if (isExists) {
            console.log(`Zaten var: ${series.link}`);
            continue;
          }

          const sql = `
            INSERT INTO series (
              link, title, poster, description, first_air_date, last_air_date, seasons, episodes, episode_duration, tmdb_rating
            ) VALUES (
              :link, :title, :poster, :description, :firstAirDate, :lastAirDate, :seasons, :episodes, :episodeDuration, :tmdbRating
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

          for (let genre of series.genres) {
            const genreSql = `INSERT INTO series_genres (series_link, genre) VALUES (:link, :genre)`;
            await connection.execute(
              genreSql,
              { link: series.link, genre },
              { autoCommit: true }
            );
          }

          for (let actor of series.actors) {
            const actorSql = `
              INSERT INTO series_actors (series_link, actor_name, character_name, actor_photo)
              VALUES (:link, :actorName, :character, :photo)
            `;
            try {
              await connection.execute(
                actorSql,
                {
                  link: series.link,
                  actorName: actor.name,
                  character: actor.character,
                  photo: actor.photo,
                },
                { autoCommit: true }
              );
            } catch (actorErr) {
              console.error(
                `❌ Actor ekleme hatası (${series.link}):`,
                actorErr.message
              );
            }
          }

          itemsData.push(series);
          console.log(`✔ Dizi eklendi: ${series.title} (${randomCategory})`);
        }
      } catch (err) {
        console.error("❌ Detay hatası:", itemUrl, err.message);
      }
    }

    res.json({
      status: "success",
      totalItems: itemsData.length,
      items: itemsData,
    });
  } catch (err) {
    console.error("❌ Veritabanı hatası:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  } finally {
    if (connection) {
      await connection.close();
      console.log("🔒 Veritabanı bağlantısı kapatıldı.");
    }
  }
});

app.listen(port, () => {
  console.log(`🚀 Sunucu http://localhost:${port} adresinde çalışıyor`);
});
