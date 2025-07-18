import styles from "../../styles/series.module.css";

export default function LoadingSpinner({ text = "Yükleniyor..." }) {
  return <div className={styles.loadingSpinner}>{text}</div>;
}
