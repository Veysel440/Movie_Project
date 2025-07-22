const express = require("express");
const router = express.Router();
const { getConnection } = require("./db");
const { handlePendingRatings } = require("./controllers/ratingController");
const { handleMovieDetail } = require("./controllers/moviesController");
const { handleSeriesDetail } = require("./controllers/seriesController");
const {
  handlePost,
  handleGet,
  handlePut,
  handleDelete,
} = require("./controllers/crudController");

const { logErrorToDB } = require("./services/loggerService");

// ✅ Merkezi hata yakalama fonksiyonu:
async function safeHandler(handlerFn, req, res, methodName) {
  try {
    await handlerFn(req, res);
  } catch (err) {
    console.error(`❌ Route Handler Hatası [${methodName}]`, err);

    await logErrorToDB(methodName, err.message, err.stack, "high");

    res.status(500).json({
      success: false,
      message: `Beklenmedik hata: ${err.message}`,
    });
  }
}

// ✅ CRUD + Özel işlemleri buraya yazıyoruz:

router.post("/pending-ratings", (req, res) =>
  safeHandler(
    handlePendingRatings.bind(null, req, res),
    req,
    res,
    "handlePendingRatings"
  )
);

router.get("/ERROR_LOGS", async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `SELECT ID, LOCATION, MESSAGE, SEVERITY, CREATED_AT FROM ERROR_LOGS ORDER BY ID DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json({ success: true, data: result.rows });
    await connection.close();
  } catch (err) {
    console.error("❌ Log Listeleme Hatası:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/ERROR_LOGS/:id", async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute(
      `SELECT DETAIL FROM ERROR_LOGS WHERE ID = :id`,
      { id: req.params.id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Kayıt bulunamadı." });
    }

    res.json({ success: true, detail: result.rows[0].DETAIL });
    await connection.close();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/ERROR_LOGS/:id", async (req, res) => {
  try {
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM ERROR_LOGS WHERE ID = :id`,
      { id: req.params.id },
      { autoCommit: true }
    );
    res.json({ success: true, message: "Log kaydı silindi." });
    await connection.close();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/series/detail/:link", (req, res) =>
  safeHandler(
    handleSeriesDetail.bind(null, req, res),
    req,
    res,
    "handleSeriesDetail"
  )
);

router.get("/movies/detail/:link", (req, res) =>
  safeHandler(
    handleMovieDetail.bind(null, req, res),
    req,
    res,
    "handleMovieDetail"
  )
);

router.post("/:table", (req, res) =>
  safeHandler(
    () => handlePost(req, res, req.params.table.toUpperCase()),
    req,
    res,
    `POST_${req.params.table}`
  )
);

router.get("/:table", (req, res) =>
  safeHandler(
    () => handleGet(req, res, req.params.table.toUpperCase()),
    req,
    res,
    `GET_${req.params.table}`
  )
);

router.put("/:table/:id", (req, res) =>
  safeHandler(
    () => handlePut(req, res, req.params.table.toUpperCase()),
    req,
    res,
    `PUT_${req.params.table}`
  )
);

router.delete("/:table/:id", (req, res) =>
  safeHandler(
    () => handleDelete(req, res, req.params.table.toUpperCase()),
    req,
    res,
    `DELETE_${req.params.table}`
  )
);

module.exports = router;
