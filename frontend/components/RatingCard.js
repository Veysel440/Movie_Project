import styles from "../styles/ratingCard.module.css";

export default function RatingCard({ comment }) {
  const {
    EMAIL = "Bilinmeyen Kullanıcı",
    COMMENT_TEXT = "Yorum yok",
    RATING = 0,
  } = comment || {};

  return (
    <div className={styles.ratingCard}>
      <div className={styles.header}>
        <strong className={styles.email}>{EMAIL}</strong>
        {/* Tarih kaldırıldı */}
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
