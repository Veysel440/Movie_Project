const axios = require("axios");
const cheerio = require("cheerio");
const dbConnection = require("../repositories/dbConnection");
const {
  categoryMap,
  getRandomCategory,
  getContentType,
} = require("../utils/categoryHelper");
const { headers } = require("../utils/headers");
const ContentManager = require("../services/contentManagerService");
const logger = require("../utils/logger");
const { logErrorToDB } = require("../services/loggerService");

exports.scrapeItems = async (count) => {
  const usedLinks = new Set();
  const itemsData = [];
  const connection = await dbConnection.getConnection();

  const MAX_RETRIES = count * 5;
  let retries = 0;

  try {
    while (itemsData.length < count && retries < MAX_RETRIES) {
      retries++;

      const randomCategory = getRandomCategory();
      const categoryUrl = categoryMap[randomCategory];
      logger.info(`Kategori: ${randomCategory} (${categoryUrl})`);

      let links = [];

      try {
        const { data } = await axios.get(categoryUrl, { headers });
        const $ = cheerio.load(data);

        $(".item.movies a, .item.tvshows a").each((_, el) => {
          const href = $(el).attr("href");
          if (href && !usedLinks.has(href)) links.push(href);
        });

        if (links.length === 0) {
          logger.warn(`İçerik bulunamadı: ${randomCategory}`);
          continue;
        }

        const itemUrl = links[Math.floor(Math.random() * links.length)];
        if (usedLinks.has(itemUrl)) continue;
        usedLinks.add(itemUrl);

        const { data: detailHtml } = await axios.get(itemUrl, { headers });
        const $$ = cheerio.load(detailHtml);

        const contentType = getContentType(itemUrl);
        const item = await ContentManager.handleContent(
          contentType,
          $$,
          itemUrl,
          randomCategory,
          connection
        );

        if (item) {
          itemsData.push(item);
          logger.info(`${contentType} eklendi: ${item.title}`);
        }
      } catch (loopError) {
        const errorMessage = `Döngü Hatası: ${loopError.message}`;
        logger.error(errorMessage);

        await logErrorToDB(
          "scraperService.loop",
          loopError.message,
          { categoryUrl, stack: loopError.stack },
          "mid"
        );
      }
    }

    return {
      status: "success",
      totalItems: itemsData.length,
      items: itemsData,
    };
  } catch (error) {
    logger.error(`Scraper Servis Hatası: ${error.message}`);

    await logErrorToDB(
      "scraperService.scrapeItems",
      error.message,
      { stack: error.stack },
      "high"
    );

    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
        logger.info("🔒 Veritabanı bağlantısı kapatıldı.");
      } catch (err) {
        logger.error(`Bağlantı kapatma hatası: ${err.message}`);

        await logErrorToDB(
          "scraperService.connectionClose",
          err.message,
          { stack: err.stack },
          "low"
        );
      }
    }
  }
};
