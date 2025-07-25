import ActorCard from "../actor/ActorCard";
import styles from "../../styles/movieActors.module.css";
import { logClientError } from "../../services/logger";

export default function MovieActors({ actors }) {
  try {
    return (
      <section>
        <h2 className={styles.sectionTitle}>Oyuncular</h2>
        <div className={styles.actorsGrid}>
          {actors.map((actor) => (
            <ActorCard key={actor.name} actor={actor} />
          ))}
        </div>
      </section>
    );
  } catch (err) {
    logError("MovieActors", err, "low");
    return <div>Oyuncular listelenemedi.</div>;
  }
}
