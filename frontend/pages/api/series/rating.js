import oracledb from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Yöntem desteklenmiyor" });
  }

  const { link, email, comment, rating } = req.body;

  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: process.env.ORACLE_CONNECTION_STRING,
    });

    const userCheck = await connection.execute(
      `SELECT email FROM "USERS" WHERE email = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (userCheck.rows.length === 0) {
      await connection.close();
      return res
        .status(400)
        .json({ status: "error", message: "Kullanıcı bulunamadı" });
    }

    const sql = `
      INSERT INTO SERIES_RATINGS_COMMENTS (LINK, EMAIL, "COMMENT", RATING, CREATED_AT)
      VALUES (:LINK, :EMAIL, :"COMMENT", :RATING, SYSDATE)
    `;
    await connection.execute(
      sql,
      { LINK: link, EMAIL: email, COMMENT: comment, RATING: rating },
      { autoCommit: true }
    );

    await connection.close();

    res
      .status(200)
      .json({ status: "success", message: "Yorum ve puan eklendi" });
  } catch (error) {
    console.error("DB Hatası:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}
