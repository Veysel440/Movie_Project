import MovieCard from "./MovieCard";
import styles from "../../styles/movies.module.css";
import { logClientError } from "../../services/logger";

export default function MoviesList({ movies }) {
  try {
    return (
      <div className={styles.movieGrid}>
        {movies.map((movie) => (
          <MovieCard key={movie.link} movie={movie} />
        ))}
      </div>
    );
  } catch (err) {
    logError("MoviesList", err, "mid");
    return <div>Filmler yüklenemedi.</div>;
  }
}
