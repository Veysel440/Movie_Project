import oracledb from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Yöntem desteklenmiyor" });
  }

  const { link, email, comment, rating } = req.body;

  const decodedLink = decodeURIComponent(link);

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: process.env.ORACLE_CONNECTION_STRING,
    });

    const movieCheck = await connection.execute(
      `SELECT link FROM MOVIES WHERE link = :link`,
      [decodedLink],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (movieCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Film bulunamadı" });
    }

    const userCheck = await connection.execute(
      `SELECT email FROM "USERS" WHERE email = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (userCheck.rows.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Kullanıcı bulunamadı" });
    }

    const sql = `
      INSERT INTO MOVIE_RATINGS_COMMENTS (LINK, EMAIL, "COMMENT", RATING, CREATED_AT)
      VALUES (:LINK, :EMAIL, :"COMMENT", :RATING, SYSDATE)
    `;

    await connection.execute(
      sql,
      {
        LINK: decodedLink,
        EMAIL: email,
        COMMENT: comment,
        RATING: rating,
      },
      { autoCommit: true }
    );

    res
      .status(200)
      .json({ status: "success", message: "Yorum ve puan eklendi" });
  } catch (error) {
    console.error("DB Hatası:", error);
    res.status(500).json({ status: "error", message: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Bağlantı kapatma hatası:", closeErr);
      }
    }
  }
}
