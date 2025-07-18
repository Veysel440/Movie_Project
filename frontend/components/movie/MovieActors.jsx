import ActorCard from "../actor/ActorCard";
import styles from "../../styles/movieActors.module.css";

export default function MovieActors({ actors }) {
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
}
