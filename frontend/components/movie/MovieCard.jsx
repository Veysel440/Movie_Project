import styles from "../../styles/movies.module.css";

export default function MovieCard({ movie }) {
  return (
    <div className={styles.card}>
      <img src={movie.poster} alt={movie.title} className={styles.poster} />
      <div className={styles.details}>
        <h3>{movie.title}</h3>
        <p>{movie.description}</p>
      </div>
    </div>
  );
}
