const { getConnection } = require("../services/oracleService");
const { tableConfig } = require("../config");
const oracledb = require("oracledb");
const { logErrorToDB } = require("../services/loggerService");

function prepareBind(req, config) {
  const key = config.primaryKey;
  if (Array.isArray(key)) {
    const ids = req.params.id.split(",");
    const bind = {};
    key.forEach((k, i) => (bind[k] = ids[i]));
    return bind;
  }
  return { [key]: req.params.id };
}

function buildBinds(data, columns, existingRecord = {}, isInsert = false) {
  const binds = {};

  columns.forEach((col) => {
    const upperCol = col.toUpperCase();
    const value = data[col] ?? data[upperCol] ?? data[col.toLowerCase()];

    if (upperCol.includes("DATE") || upperCol.includes("_AT")) {
      binds[col] = value ? new Date(value) : new Date();
    } else if (upperCol === "PASSWORD") {
      binds[col] =
        value === undefined
          ? existingRecord[col] || existingRecord[upperCol] || null
          : value;
    } else {
      binds[col] = value === "" || value === undefined ? null : value;
    }
  });

  return binds;
}

async function handlePost(req, res, table) {
  const connection = await getConnection();
  try {
    const config = tableConfig[table];
    if (!config) throw new Error(`Tablo bulunamadı: ${table}`);

    const data = req.body;
    if (table === "USERS" && !data.CREATED_AT) {
      data.CREATED_AT = new Date();
    }

    const columns =
      config.columns.includes("ID") && !data.ID
        ? config.columns.filter((c) => c !== "ID")
        : config.columns;

    const binds = buildBinds(data, columns, {}, true);

    const sql = `INSERT INTO "${table}" (${columns.join(
      ", "
    )}) VALUES (${columns.map((c) => `:${c}`).join(", ")})`;

    console.log("[SQL]", sql);
    console.log("[Binds]", binds);

    await connection.execute(sql, binds, { autoCommit: true });

    res.json({ success: true, message: "Kayıt başarıyla eklendi." });
  } catch (err) {
    console.error("🔥 Ekleme Hatası (Oracle):", err);
    await logErrorToDB("handlePost", err.message, err.stack, "high");
    res
      .status(500)
      .json({
        success: false,
        message: "Ekleme başarısız.",
        errorMessage: err.message,
      });
  } finally {
    await connection.close();
  }
}

async function handlePut(req, res, table) {
  const connection = await getConnection();
  try {
    const config = tableConfig[table];
    const data = req.body;
    const columns = config.columns.filter(
      (c) => c !== config.primaryKey && c !== "ID"
    );
    const pkBinds = prepareBind(req, config);
    const whereClause = Array.isArray(config.primaryKey)
      ? config.primaryKey.map((k) => `${k} = :${k}`).join(" AND ")
      : `${config.primaryKey} = :${config.primaryKey}`;

    const sqlSelect = `SELECT * FROM "${table}" WHERE ${whereClause}`;
    const existingResult = await connection.execute(sqlSelect, pkBinds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    const existingRecord = existingResult.rows[0] || {};

    const binds = {
      ...buildBinds(data, columns, existingRecord, false),
      ...pkBinds,
    };
    const setClause = columns.map((c) => `${c} = :${c}`).join(", ");
    const sql = `UPDATE "${table}" SET ${setClause} WHERE ${whereClause}`;

    await connection.execute(sql, binds, { autoCommit: true });

    res.json({ success: true, message: "Kayıt başarıyla güncellendi." });
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    await logErrorToDB("handlePut", err.message, err.stack, "mid");
    res.status(500).json({ success: false, message: "Güncelleme hatası." });
  } finally {
    await connection.close();
  }
}

async function handleDelete(req, res, table) {
  const connection = await getConnection();
  try {
    const config = tableConfig[table];
    const binds = prepareBind(req, config);
    const whereClause = Array.isArray(config.primaryKey)
      ? config.primaryKey.map((k) => `${k} = :${k}`).join(" AND ")
      : `${config.primaryKey} = :${config.primaryKey}`;

    const sql = `DELETE FROM "${table}" WHERE ${whereClause}`;
    await connection.execute(sql, binds, { autoCommit: true });

    res.json({ success: true, message: "Kayıt başarıyla silindi." });
  } catch (err) {
    console.error("Silme hatası:", err);
    await logErrorToDB("handleDelete", err.message, err.stack, "mid");
    res.status(500).json({ success: false, message: "Silme hatası." });
  } finally {
    await connection.close();
  }
}

async function handleGet(req, res, table) {
  const connection = await getConnection();
  try {
    const sql = `SELECT * FROM "${table}"`;
    const result = await connection.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("GET hatası:", err);
    await logErrorToDB("handleGet", err.message, err.stack, "low");
    res.status(500).json({ success: false, message: "Veri çekme hatası." });
  } finally {
    await connection.close();
  }
}

module.exports = {
  handlePost,
  handlePut,
  handleDelete,
  handleGet,
};
