import styles from "../../styles/movieActors.module.css";
import { logClientError } from "../../services/logger";

export default function ActorCard({ actor }) {
  try {
    if (!actor || !actor.name) {
      throw new Error("Eksik aktör verisi");
    }

    return (
      <div className={styles.actorCard} role="region" aria-label={actor.name}>
        <div className={styles.imageWrapper}>
          {actor.photo ? (
            <img
              className={styles.actorPhoto}
              src={actor.photo}
              alt={actor.name}
              onError={(e) => {
                e.target.style.display = "none";
                logClientError(
                  "ActorCard",
                  "Aktör fotoğrafı yüklenemedi",
                  `actor.name: ${actor.name} - URL: ${actor.photo}`,
                  "low"
                );
              }}
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
  } catch (err) {
    logClientError("ActorCard", err.message, JSON.stringify(actor), "mid");
    return (
      <div className={styles.actorCard}>
        <p>❌ Aktör bilgisi yüklenemedi.</p>
      </div>
    );
  }
}
