import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/moviesPage.module.css";
import { fetchMovies } from "../../lib/api/movies";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { logClientError } from "../../services/logger";

const MOVIES_PER_PAGE = 25;

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const loadMovies = useCallback(async (page) => {
    try {
      const data = await fetchMovies(page, MOVIES_PER_PAGE);
      const newMovies = data.movies || [];
      setMovies((prev) => [...prev, ...newMovies]);
      return (
        newMovies.length >= MOVIES_PER_PAGE &&
        page * MOVIES_PER_PAGE < data.total
      );
    } catch (err) {
      setError(err.message);
      logError("MoviesPage:fetchMovies", err, "high");
      return false;
    }
  }, []);

  const { observerRef, isLoading, hasMore } = useInfiniteScroll(loadMovies);

  const handleClick = (movie) => {
    try {
      router.push(`/movies/${encodeURIComponent(movie.link)}`);
    } catch (err) {
      logError("MoviesPage:handleClick", err, "mid");
    }
  };

  if (error) {
    logError("MoviesPage:render", error, "mid");
    return <div className={styles.errorMessage}>Hata: {error}</div>;
  }

  return (
    <div className={styles.moviesPage}>
      <h1 className={styles.moviesTitle}>🎬 Filmler</h1>
      <div className={styles.moviesGrid}>
        {movies.map((movie) => (
          <div
            key={movie.link}
            className={styles.movieCard}
            onClick={() => handleClick(movie)}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className={styles.moviePoster}
            />
            <div className={styles.movieInfo}>
              <h3>{movie.title}</h3>
              <p>{movie.description?.slice(0, 60)}</p>
            </div>
          </div>
        ))}
      </div>
      {isLoading && <p>Yükleniyor...</p>}
      {hasMore && (
        <div ref={observerRef} className={styles.loadingMore}>
          Daha fazla film yükleniyor...
        </div>
      )}
    </div>
  );
}
