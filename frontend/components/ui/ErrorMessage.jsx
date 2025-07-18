import styles from "../../styles/series.module.css";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.errorContainer}>
      <p>{message}</p>
      <button onClick={onRetry} className={styles.retryButton}>
        Tekrar Dene
      </button>
    </div>
  );
}
