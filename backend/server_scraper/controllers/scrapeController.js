const scraperService = require("../services/scraperService");

exports.scrape = async (req, res) => {
  const count = parseInt(req.body.count) || 10;

  try {
    const result = await scraperService.scrapeItems(count);
    res.json(result);
  } catch (err) {
    console.error("❌ Controller Hatası:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
};
