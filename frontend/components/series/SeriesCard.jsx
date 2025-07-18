import Link from "next/link";
import styles from "../../styles/series.module.css";

export default function SeriesCard({ item }) {
  if (!item) return <div className={styles.card}>Yükleniyor...</div>;

  let slug = item.link;
  if (item.link.startsWith("http")) {
    slug = item.link.replace("https://dizimag.eu/dizi/", "").replace(/\/$/, "");
  }

  return (
    <Link href={`/series/${encodeURIComponent(slug)}`} legacyBehavior>
      <a className={styles.cardLink}>
        <div className={styles.card}>
          {item.poster && (
            <img src={item.poster} alt={item.title} className={styles.poster} />
          )}
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.description}>{item.description}</p>
        </div>
      </a>
    </Link>
  );
}
