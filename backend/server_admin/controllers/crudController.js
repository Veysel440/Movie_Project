const { getConnection } = require("../services/oracleService");
const { tableConfig } = require("../config");
const { formatDateForOracle } = require("../utils/dateFormatter");
const oracledb = require("oracledb");

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
      binds[col] = isInsert
        ? formatDateForOracle(new Date().toISOString())
        : formatDateForOracle(value);
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
    const columns = config.columns.filter((c) => c !== "ID");

    const binds = buildBinds(data, columns, {}, true);

    const sql = `
      INSERT INTO "${table}" (${columns.join(", ")})
      VALUES (${columns.map((c) => `:${c}`).join(", ")})
    `;

    await connection.execute(sql, binds, { autoCommit: true });

    res.json({ success: true, message: "Kayıt başarıyla eklendi." });
  } catch (err) {
    if (err.errorNum === 1) {
      res.status(400).json({
        success: false,
        message: "Bu veri zaten mevcut. Aynı kaydı tekrar ekleyemezsiniz.",
      });
    } else if (err.errorNum === 1843) {
      res.status(400).json({
        success: false,
        message: "Geçersiz tarih formatı. Otomatik tarih atanamadı.",
      });
    } else {
      console.error("Ekleme hatası:", err);
      res.status(500).json({ success: false, message: "Ekleme hatası." });
    }
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
