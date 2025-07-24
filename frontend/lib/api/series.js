import { logClientError } from "../../services/logger";

export async function fetchSeriesDetail(link) {
  try {
    const res = await fetch(`/api/series/${encodeURIComponent(link)}`);
    if (!res.ok) throw new Error("Dizi detayları alınamadı");
    const data = await res.json();
    if (data.status !== "success")
      throw new Error(data.message || "Veri alınamadı");
    return data;
  } catch (err) {
    logClientError(
      "fetchSeriesDetail",
      "Dizi detay çekme hatası",
      err?.message,
      "mid"
    );
    throw err;
  }
}

export async function fetchSeries(page = 1, limit = 10) {
  try {
    const res = await fetch(`/api/series?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("API isteği başarısız");
    const data = await res.json();
    if (data.status !== "success")
      throw new Error(data.message || "Bilinmeyen API hatası");
    return data;
  } catch (err) {
    logClientError(
      "fetchSeries",
      "Dizi liste çekme hatası",
      err?.message,
      "mid"
    );
    throw err;
  }
}
