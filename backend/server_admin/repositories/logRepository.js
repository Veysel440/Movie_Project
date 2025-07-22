const { getConnection } = require("../services/oracleService");

exports.getLogs = async (severity = null) => {
  const connection = await getConnection();
  try {
    const baseQuery = `
      SELECT ID, LOCATION, MESSAGE, SEVERITY, CREATED_AT
      FROM ERROR_LOGS
      ${severity ? "WHERE SEVERITY = :severity" : ""}
      ORDER BY CREATED_AT DESC
    `;

    const binds = severity ? { severity } : {};
    const result = await connection.execute(baseQuery, binds, {
      outFormat: require("oracledb").OUT_FORMAT_OBJECT,
    });

    return result.rows;
  } finally {
    await connection.close();
  }
};
