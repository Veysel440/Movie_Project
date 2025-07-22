const movieService = require("./movieService");
const seriesService = require("./seriesService");
const logger = require("../utils/logger");
const { logErrorToDB } = require("../services/loggerService");

/**
 * İçerik türüne göre ilgili servise yönlendirir.
 *
 * @param {string} contentType
 * @param {CheerioStatic} $$
 * @param {string} itemUrl
 * @param {string} category
 * @param {OracleConnection} connection
 * @returns {Object|null}
 */
exports.handleContent = async (
  contentType,
  $$,
  itemUrl,
  category,
  connection
) => {
  try {
    switch (contentType) {
      case "movie":
        return await movieService.handleMovie(
          $$,
          itemUrl,
          category,
          connection
        );

      case "series":
        return await seriesService.handleSeries(
          $$,
          itemUrl,
          category,
          connection
        );

      default:
        const warnMessage = `Bilinmeyen içerik türü atlandı: ${itemUrl}`;
        logger.warn(warnMessage);
        await logErrorToDB(
          "contentManagerService.handleContent",
          warnMessage,
          { itemUrl, contentType },
          "low"
        );
        return null;
    }
  } catch (error) {
    const errorMessage = `İçerik işleme hatası [${contentType}] (${itemUrl}): ${error.message}`;

    logger.error(errorMessage);

    await logErrorToDB(
      "contentManagerService.handleContent",
      error.message,
      {
        contentType,
        itemUrl,
        category,
        stack: error.stack,
      },
      "mid"
    );

    return null;
  }
};
