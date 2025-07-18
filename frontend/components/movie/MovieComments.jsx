import RatingForm from "../RatingForm";
import RatingCard from "../RatingCard";
import styles from "../../styles/movieDetail.module.css";

export default function MovieComments({ link, comments, reload }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Yorum Yap ve Puan Ver</h2>
      <RatingForm
        link={link}
        type="movie"
        onSuccess={reload}
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
