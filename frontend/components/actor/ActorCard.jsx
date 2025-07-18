import styles from "../../styles/movieActors.module.css";

export default function ActorCard({ actor }) {
  return (
    <div className={styles.actorCard} role="region" aria-label={actor.name}>
      <div className={styles.imageWrapper}>
        {actor.photo ? (
          <img
            className={styles.actorPhoto}
            src={actor.photo}
            alt={actor.name}
          />
        ) : (
          <div className={styles.actorAvatar}>{actor.name.charAt(0)}</div>
        )}
      </div>
      <div className={styles.actorInfo}>
        <p className={styles.actorName}>{actor.name}</p>
        <p className={styles.characterName}>
          {actor.character || "Karakter bilinmiyor"}
        </p>
      </div>
    </div>
  );
}
