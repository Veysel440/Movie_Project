const express = require("express");
const app = express();
const scrapeRoutes = require("./routes/scrapeRoutes");
const { logErrorToDB } = require("./services/loggerService");

const PORT = 3000;

app.use(express.json());

app.use("/api", scrapeRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(async (err, req, res, next) => {
  console.error("🔥 Global Hata:", err);

  await logErrorToDB("server_scraper/app.js", err.message, err.stack, "high");

  res.status(500).json({ error: "Sunucu hatası.", detail: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
