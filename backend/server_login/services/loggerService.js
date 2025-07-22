const { getConnection } = require("../db");

async function logErrorToDB(
  location,
  message,
  detail = null,
  severity = "mid"
) {
  let connection;
  try {
    connection = await getConnection();
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
    console.error("Log kaydı yapılamadı:", logErr.message);
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { logErrorToDB };
