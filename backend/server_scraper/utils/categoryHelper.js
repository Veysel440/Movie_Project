const { logErrorToDB } = require("../services/loggerService");

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

function getContentType(url) {
  if (!url) return null;
  if (url.includes("/belgesel/")) return "documentary";
  if (url.includes("/dizi/")) return "series";
  return "movie";
}

async function getRandomCategory() {
  const allCategories = Object.keys(categoryMap);

  if (allCategories.length === 0) {
    await logErrorToDB(
      "categoryHelper.getRandomCategory",
      "Kategori listesi boş!",
      null,
      "high"
    );
    throw new Error("Kategori listesi boş! Scraper durduruldu.");
  }

  try {
    const shuffled = allCategories.sort(() => 0.5 - Math.random());
    return shuffled[0];
  } catch (error) {
    await logErrorToDB(
      "categoryHelper.getRandomCategory",
      error.message,
      error.stack,
      "mid"
    );

    console.warn("⚠ Kategori seçilemedi, yeniden denenecek...");

    return getRandomCategory();
  }
}

module.exports = {
  categoryMap,
  getContentType,
  getRandomCategory,
};
