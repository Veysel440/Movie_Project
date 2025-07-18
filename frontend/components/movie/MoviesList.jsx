import MovieCard from "./MovieCard";
import styles from "../../styles/movies.module.css";

export default function MoviesList({ movies }) {
  return (
    <div className={styles.movieGrid}>
      {movies.map((movie) => (
        <MovieCard key={movie.link} movie={movie} />
      ))}
    </div>
  );
}
