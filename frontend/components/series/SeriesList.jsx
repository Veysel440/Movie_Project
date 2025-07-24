import SeriesCard from "./SeriesCard";
import styles from "../../styles/series.module.css";
import { logClientError } from "../../services/logger";

export default function SeriesList({ series }) {
  if (!Array.isArray(series)) {
    logClientError(
      "SeriesList",
      "series array değil",
      JSON.stringify(series),
      "mid"
    );
    return <p>Dizi listesi yüklenemedi.</p>;
  }
  return (
    <div className={styles.seriesGrid}>
      {series.map((item) => (
        <SeriesCard key={item.link} item={item} />
      ))}
    </div>
  );
}
