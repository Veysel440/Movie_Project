import ActorCard from "../actor/ActorCard";
import styles from "../../styles/seriesDetail.module.css";

export default function SeriesActors({ actors }) {
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
