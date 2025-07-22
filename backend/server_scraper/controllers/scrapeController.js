const scraperService = require("../services/scraperService");
const { logErrorToDB } = require("../services/loggerService");

exports.scrape = async (req, res) => {
  const count = parseInt(req.body.count) || 10;

  try {
    const result = await scraperService.scrapeItems(count);
    res.json(result);
  } catch (err) {
    console.error("❌ Controller Hatası:", err.message);

    await logErrorToDB(
      "scrapeController.scrape",
      err.message,
      err.stack,
      "mid"
    );

    res.status(500).json({
      status: "error",
      message: err.message || "Scraper controller hatası",
    });
  }
};
