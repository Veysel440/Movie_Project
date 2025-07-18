import Link from "next/link";
import styles from "../styles/admin.module.css";

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Menü</h2>
      <ul className={styles.menu}>
        <li>
          <Link href="#" onClick={() => setActiveTab("MOVIES")}>
            🎬 Filmler
          </Link>
        </li>
        <li>
          <Link href="#" onClick={() => setActiveTab("USERS")}>
            👤 Kullanıcılar
          </Link>
        </li>
        <li>
          <Link href="#" onClick={() => setActiveTab("SERIES")}>
            📺 Diziler
          </Link>
        </li>
        <li>
          <Link href="#" onClick={() => setActiveTab("MOVIE_ACTORS")}>
            🎭 Film Oyuncuları
          </Link>
        </li>
        <li>
          <Link href="#" onClick={() => setActiveTab("MOVIE_GENRES")}>
            🎥 Film Türleri
          </Link>
        </li>
        <li>
          <Link href="#" onClick={() => setActiveTab("MOVIE_RATINGS_COMMENTS")}>
            💬 Film Yorumları
          </Link>
        </li>
        <li>
          <Link
            href="#"
            onClick={() => setActiveTab("SERIES_RATINGS_COMMENTS")}
          >
            💬 Dizi Yorumları
          </Link>
        </li>
        <li>
          <Link href="#" onClick={() => setActiveTab("SERIES_ACTORS")}>
            🎭 Dizi Oyuncuları
          </Link>
        </li>
        <li>
          <Link href="#" onClick={() => setActiveTab("SERIES_GENRES")}>
            🎥 Dizi Türleri
          </Link>
        </li>
      </ul>
    </div>
  );
}
