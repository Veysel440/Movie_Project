export async function fetchSeriesDetail(link) {
  const res = await fetch(`/api/series/${encodeURIComponent(link)}`);
  if (!res.ok) throw new Error("Dizi detayları alınamadı");
  const data = await res.json();
  if (data.status !== "success")
    throw new Error(data.message || "Veri alınamadı");
  return data;
}

export async function fetchSeries(page = 1, limit = 10) {
  const res = await fetch(`/api/series?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("API isteği başarısız");
  const data = await res.json();
  if (data.status !== "success")
    throw new Error(data.message || "Bilinmeyen API hatası");
  return data;
}
