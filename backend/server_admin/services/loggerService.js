const { getConnection } = require("./oracleService");

async function logErrorToDB(
  location,
  message,
  detail = null,
  severity = "mid"
) {
  const connection = await getConnection();
  try {
    await connection.execute(
      `INSERT INTO ERROR_LOGS (LOCATION, MESSAGE, DETAIL, SEVERITY, CREATED_AT)
       VALUES (:location, :message, :detail, :severity, SYSTIMESTAMP)`,
      {
        location,
        message,
        detail: detail ? JSON.stringify(detail) : null,
        severity,
      },
      { autoCommit: true }
    );
  } catch (logErr) {
    console.error("Loglama hatası:", logErr);
  } finally {
    await connection.close();
  }
}

module.exports = { logErrorToDB };
