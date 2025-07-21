const axios = require("axios");
const cheerio = require("cheerio");
const oracledb = require("oracledb");

const {
  categoryMap,
  getRandomCategory,
  getContentType,
} = require("../utils/categoryHelper");
const { headers } = require("../utils/headers");

const movieService = require("./movieService");
const seriesService = require("./seriesService");
const dbConnection = require("../repositories/dbConnection");

exports.scrapeItems = async (count) => {
  const usedLinks = new Set();
  const itemsData = [];
  const connection = await dbConnection.getConnection();

  try {
    while (itemsData.length < count) {
      try {
        const randomCategory = getRandomCategory();
        const categoryUrl = categoryMap[randomCategory];
        console.log(`Kategori: ${randomCategory} (${categoryUrl})`);

        const { data } = await axios.get(categoryUrl, { headers });
        const $ = cheerio.load(data);

        let links = [];

        // ✅ Hem dizileri hem filmleri kapsayacak şekilde içerik linklerini topla
        $(".item.movies a, .item.tvshows a").each((_, el) => {
          const href = $(el).attr("href");
          if (href && !usedLinks.has(href)) {
            links.push(href);
          }
        });

        if (links.length === 0) {
          console.log(`⚠️ İçerik bulunamadı: ${randomCategory}`);
          continue;
        }

        const itemUrl = links[Math.floor(Math.random() * links.length)];
        if (usedLinks.has(itemUrl)) continue;
        usedLinks.add(itemUrl);

        const { data: detailHtml } = await axios.get(itemUrl, { headers });
        const $$ = cheerio.load(detailHtml);

        const contentType = getContentType(itemUrl);

        if (contentType === "movie" || contentType === "series") {
          let item = null;

          if (contentType === "movie") {
            item = await movieService.handleMovie(
              $$,
              itemUrl,
              randomCategory,
              connection
            );
          } else {
            item = await seriesService.handleSeries(
              $$,
              itemUrl,
              randomCategory,
              connection
            );
          }

          if (item) {
            itemsData.push(item);
            console.log(
              `✔ ${contentType === "movie" ? "Film" : "Dizi"} eklendi: ${
                item.title
              }`
            );
          }
        } else {
          console.log(`⚠️ Tür tanımlanamayan içerik atlandı: ${itemUrl}`);
        }
      } catch (loopError) {
        console.error("❌ İçerik işleme hatası:", loopError.message);
      }
    }

    return {
      status: "success",
      totalItems: itemsData.length,
      items: itemsData,
    };
  } catch (error) {
    console.error("❌ Scraper servis hatası:", error.message);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("🔒 Veritabanı bağlantısı kapatıldı.");
      } catch (err) {
        console.error("❌ Bağlantı kapatma hatası:", err.message);
      }
    }
  }
};
