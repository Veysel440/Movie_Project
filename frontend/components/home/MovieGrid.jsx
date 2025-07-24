import MovieCard from "./MovieCard";
import { logClientError } from "../../services/logger";

export default function MovieGrid({ movies }) {
  try {
    if (!Array.isArray(movies)) {
      throw new Error("movies dizisi geçersiz");
    }

    if (!movies.length) return <p>Hiç film bulunamadı.</p>;

    return (
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.link} movie={movie} />
        ))}
      </div>
    );
  } catch (err) {
    logClientError("MovieGrid", err.message, JSON.stringify(movies), "mid");
    return <p>❌ Filmler yüklenirken hata oluştu.</p>;
  }
}
