import ActorCard from "../actor/ActorCard";
import styles from "../../styles/seriesDetail.module.css";
import { logClientError } from "../../services/logger";

export default function SeriesActors({ actors }) {
  if (!Array.isArray(actors)) {
    logClientError(
      "SeriesActors",
      "Oyuncu listesi geçersiz",
      JSON.stringify(actors),
      "low"
    );
    return <p>Oyuncu listesi yüklenemedi.</p>;
  }
  return (
    <>
      <h2 className={styles.sectionTitle}>Oyuncular</h2>
      <div className={styles.actorsList}>
        {actors.map((actor) => (
          <ActorCard key={actor.name} actor={actor} />
        ))}
      </div>
    </>
  );
}
