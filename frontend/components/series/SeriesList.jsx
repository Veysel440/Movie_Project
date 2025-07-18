import SeriesCard from "./SeriesCard";
import styles from "../../styles/series.module.css";

export default function SeriesList({ series }) {
  return (
    <div className={styles.seriesGrid}>
      {series.map((item) => (
        <SeriesCard key={item.link} item={item} />
      ))}
    </div>
  );
}
