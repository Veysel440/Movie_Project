import useMovies from "../hooks/useMovies";
import SearchInput from "../components/home/SearchInput";
import MovieGrid from "../components/home/MovieGrid";

export default function HomePage() {
  const { loading, movies, search, setSearch } = useMovies();

  return (
    <main className="container">
      <h1>Anasayfa</h1>

      <SearchInput value={search} onChange={setSearch} />

      {loading ? <p>Yükleniyor...</p> : <MovieGrid movies={movies} />}
    </main>
  );
}
