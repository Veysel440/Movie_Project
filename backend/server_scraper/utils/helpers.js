exports.insertGenres = async (
  genres,
  link,
  tableName,
  linkColumn,
  connection
) => {
  for (let genre of genres) {
    try {
      await connection.execute(
        `INSERT INTO ${tableName} (${linkColumn}, genre) VALUES (:link, :genre)`,
        { link, genre },
        { autoCommit: true }
      );
    } catch (err) {
      console.error(`❌ Tür ekleme hatası (${link}):`, err.message);
    }
  }
};

exports.insertActors = async (
  actors,
  link,
  tableName,
  linkColumn,
  connection
) => {
  for (let actor of actors) {
    try {
      await connection.execute(
        `INSERT INTO ${tableName} (${linkColumn}, actor_name, character_name, actor_photo) VALUES (:link, :actorName, :character, :photo)`,
        {
          link,
          actorName: actor.name,
          character: actor.character,
          photo: actor.photo,
        },
        { autoCommit: true }
      );
    } catch (err) {
      console.error(`❌ Aktör ekleme hatası (${link}):`, err.message);
    }
  }
};
