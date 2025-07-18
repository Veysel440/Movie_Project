export async function fetchMovies(count = 10) {
  const res = await fetch(`http://localhost:3000/scrape?count=${count}`);
  if (!res.ok) throw new Error("Veriler alınamadı");
  return await res.json();
}
