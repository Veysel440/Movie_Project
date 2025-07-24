import styles from "../../styles/movieDetail.module.css";
import { logError } from "../../utils/logger";

export default function MovieMain({ movie, genres, avgRating, ratingCount }) {
  try {
    return (
      <div className={styles.movieMain}>
        <img className={styles.poster} src={movie.poster} alt={movie.title} />
        <div className={styles.info}>
          <h1>{movie.title}</h1>
          <p>
            <strong>Açıklama:</strong> {movie.description || "Yok"}
          </p>
          <p>
            <strong>Çıkış Tarihi:</strong> {movie.release_date || "Bilinmiyor"}
          </p>
          <p>
            <strong>Türü:</strong> {genres.join(", ") || "Bilinmiyor"}
          </p>
          <p>
            <strong>IMDb Puanı:</strong> {movie.imdb_rating || "Bilinmiyor"}
          </p>
          <p>
            <strong>TMDb Puanı:</strong> {movie.tmdb_rating || "Bilinmiyor"}
          </p>
          <p>
            <strong>Ülke:</strong> {movie.country || "Bilinmiyor"}
          </p>
          <p>
            <strong>Süresi:</strong> {movie.duration || "Bilinmiyor"}
          </p>
          <p>
            <strong>Ortalama Puan:</strong> {avgRating.toFixed(1)} / 5 (
            {ratingCount} oy)
          </p>
        </div>
      </div>
    );
  } catch (err) {
    logError("MovieMain", err, "low");
    return <div>Film detayları yüklenemedi.</div>;
  }
}
