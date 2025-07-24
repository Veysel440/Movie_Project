import RatingForm from "./SeriesRatingForm";
import RatingCard from "./SeriesRatingCard";
import styles from "../../styles/seriesDetail.module.css";
import { logClientError } from "../../services/logger";

export default function SeriesComments({ link, comments, onNewComment }) {
  if (!Array.isArray(comments)) {
    logClientError(
      "SeriesComments",
      "comments array değil",
      JSON.stringify(comments),
      "mid"
    );
    return <p>Yorumlar yüklenemedi.</p>;
  }
  return (
    <>
      <h2 className={styles.sectionTitle}>Yorum Yap ve Puan Ver</h2>
      <RatingForm
        link={link}
        onSuccess={onNewComment}
        className={styles.ratingForm}
      />
      <h2 className={styles.sectionTitle}>Yorumlar</h2>
      <div className={styles.ratingsList}>
        {comments.map((comment) => (
          <RatingCard
            key={`${comment.EMAIL}-${comment.CREATED_AT}`}
            comment={comment}
          />
        ))}
      </div>
    </>
  );
}
