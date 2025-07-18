export async function fetchMovieDetail(link) {
  const res = await fetch(
    `/api/movies/${encodeURIComponent(link)}?status=approved`
  );
  if (!res.ok) throw new Error("Film detayları alınamadı");
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(data.message || "Veri alınamadı");
  }
  return data;
}

export async function fetchMovies(page, limit) {
  const res = await fetch(`/api/movies?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("API isteği başarısız");
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(data.message || "Bilinmeyen API hatası");
  }
  return data;
}
