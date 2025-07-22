const { getConnection } = require("../services/oracleService");

async function getAllLogs(req, res) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT * FROM ERROR_LOGS ORDER BY ID DESC`,
      [],
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Log listeleme hatası:", err);
    res.status(500).json({ success: false, message: "Loglar alınamadı." });
  } finally {
    await connection.close();
  }
}

async function getLogDetail(req, res) {
  const { id } = req.params;
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT * FROM ERROR_LOGS WHERE ID = :id`,
      { id },
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Log bulunamadı." });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Log detay hatası:", err);
    res.status(500).json({ success: false, message: "Log detayı alınamadı." });
  } finally {
    await connection.close();
  }
}

async function deleteLog(req, res) {
  const { id } = req.params;
  const connection = await getConnection();
  try {
    await connection.execute(
      `DELETE FROM ERROR_LOGS WHERE ID = :id`,
      { id },
      { autoCommit: true }
    );

    res.json({ success: true, message: `Log ID ${id} silindi.` });
  } catch (err) {
    console.error("Log silme hatası:", err);
    res.status(500).json({ success: false, message: "Silme başarısız." });
  } finally {
    await connection.close();
  }
}

module.exports = { getAllLogs, getLogDetail, deleteLog };
