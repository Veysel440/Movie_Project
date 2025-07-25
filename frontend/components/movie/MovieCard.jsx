import styles from "../../styles/movies.module.css";
import { logClientError } from "../../services/logger";

export default function MovieCard({ movie }) {
  try {
    return (
      <div className={styles.card}>
        <img src={movie.poster} alt={movie.title} className={styles.poster} />
        <div className={styles.details}>
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
        </div>
      </div>
    );
  } catch (err) {
    logError("MovieCard", err, "low");
    return <div>Film kartı yüklenemedi.</div>;
  }
}
