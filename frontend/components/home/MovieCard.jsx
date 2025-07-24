import { useRouter } from "next/router";
import { logClientError } from "../../services/logger";

export default function MovieCard({ movie }) {
  const router = useRouter();

  const handleClick = () => {
    try {
      if (!movie || !movie.link) {
        throw new Error("Film verisi eksik");
      }
      router.push(`/movies/${encodeURIComponent(movie.link)}`);
    } catch (err) {
      logClientError("MovieCard", err.message, JSON.stringify(movie), "mid");
    }
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img
        src={movie.poster}
        alt={movie.title}
        onError={(e) => {
          e.target.style.display = "none";
          logClientError(
            "MovieCard",
            "Poster yüklenemedi",
            `movie.title: ${movie?.title} - URL: ${movie?.poster}`,
            "low"
          );
        }}
      />
      <div className="title">{movie.title}</div>
    </div>
  );
}
