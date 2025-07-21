const express = require("express");
const app = express();
const scrapeRoutes = require("./routes/scrapeRoutes");

const PORT = 3000;

// ✅ Gelen JSON body'leri parse etmek için:
app.use(express.json());

// ✅ Tüm endpointleri kullanıma aç:
app.use("/api", scrapeRoutes);

// ✅ Sunucu ayağa kalktığında bilgi ver:
app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
