import Link from "next/link";
import styles from "../../styles/series.module.css";
import { logClientError } from "../../services/logger";

export default function SeriesCard({ item }) {
  if (!item) {
    logClientError("SeriesCard", "item prop yok veya undefined", "", "mid");
    return <div className={styles.card}>Yükleniyor...</div>;
  }

  let slug = item.link;
  try {
    if (item.link.startsWith("http")) {
      slug = item.link
        .replace("https://dizimag.eu/dizi/", "")
        .replace(/\/$/, "");
    }
  } catch (err) {
    logClientError("SeriesCard", "Slug işlemede hata", err.message, "low");
    slug = "";
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
