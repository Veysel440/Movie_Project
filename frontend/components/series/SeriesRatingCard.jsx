import styles from "../../styles/ratingCard.module.css";
import { logClientError } from "../../services/logger";

export default function SeriesRatingCard({ comment }) {
  if (!comment) {
    logClientError("SeriesRatingCard", "comment yok", "", "low");
    return <div>Yorum yüklenemedi.</div>;
  }

  const {
    EMAIL = "Bilinmeyen Kullanıcı",
    COMMENT_TEXT = "Yorum yok",
    RATING = 0,
  } = comment || {};

  return (
    <div className={styles.ratingCard}>
      <div className={styles.header}>
        <strong className={styles.email}>{EMAIL}</strong>
      </div>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= RATING ? styles.filled : ""}`}
          >
            ★
          </span>
        ))}
      </div>
      <p className={styles.comment}>{COMMENT_TEXT}</p>
    </div>
  );
}
