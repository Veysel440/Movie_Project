import styles from "../../styles/seriesDetail.module.css";

export default function SeriesMain({ series, genres, avgRating, ratingCount }) {
  return (
    <div className={styles.seriesMain}>
      <img className={styles.poster} src={series.poster} alt={series.title} />
      <div className={styles.info}>
        <h1>{series.title}</h1>
        <p>
          <strong>Açıklama:</strong> {series.description || "Yok"}
        </p>
        <p>
          <strong>İlk Yayın:</strong> {series.first_air_date || "Bilinmiyor"}
        </p>
        <p>
          <strong>Son Yayın:</strong> {series.last_air_date || "Bilinmiyor"}
        </p>
        <p>
          <strong>Sezon:</strong> {series.seasons || "Bilinmiyor"}
        </p>
        <p>
          <strong>Bölüm:</strong> {series.episodes || "Bilinmiyor"}
        </p>
        <p>
          <strong>Bölüm Süresi:</strong>{" "}
          {series.episode_duration || "Bilinmiyor"}
        </p>
        <p>
          <strong>Tür:</strong> {genres.join(", ") || "Bilinmiyor"}
        </p>
        <p>
          <strong>TMDb Puanı:</strong> {series.tmdb_rating || "Bilinmiyor"}
        </p>
        <p>
          <strong>Ortalama Puan:</strong> {avgRating.toFixed(1)} / 5 (
          {ratingCount} oy)
        </p>
      </div>
    </div>
  );
}
