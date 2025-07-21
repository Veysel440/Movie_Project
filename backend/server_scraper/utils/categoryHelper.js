// utils/categoryHelper.js

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
  if (url.includes("/belgesel/")) return "documentary";
  if (url.includes("/dizi/")) return "series";
  return "movie";
}

function getRandomCategory() {
  const allCategories = Object.keys(categoryMap);
  const shuffled = allCategories.sort(() => 0.5 - Math.random());
  return shuffled[0];
}

module.exports = {
  categoryMap,
  getContentType,
  getRandomCategory,
};
