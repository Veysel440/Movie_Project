import { logClientError } from "../../services/logger";

export async function fetchMovieDetail(link) {
  try {
    const res = await fetch(
      `/api/movies/${encodeURIComponent(link)}?status=approved`
    );
    if (!res.ok) throw new Error("Film detayları alınamadı");
    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Veri alınamadı");
    }
    return data;
  } catch (err) {
    logClientError(
      "fetchMovieDetail",
      "Film detay çekme hatası",
      err?.message,
      "mid"
    );
    throw err;
  }
}

export async function fetchMovies(page, limit) {
  try {
    const res = await fetch(`/api/movies?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("API isteği başarısız");
    const data = await res.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Bilinmeyen API hatası");
    }
    return data;
  } catch (err) {
    logClientError(
      "fetchMovies",
      "Film liste çekme hatası",
      err?.message,
      "mid"
    );
    throw err;
  }
}
