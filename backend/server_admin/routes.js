const express = require("express");
const router = express.Router();

const { handlePendingRatings } = require("./controllers/ratingController");
const { handleMovieDetail } = require("./controllers/moviesController");
const { handleSeriesDetail } = require("./controllers/seriesController");
const {
  handlePost,
  handleGet,
  handlePut,
  handleDelete,
} = require("./controllers/crudController");

router.post("/pending-ratings", handlePendingRatings);

router.get("/series/detail/:link", handleSeriesDetail);

router.get("/movies/detail/:link", handleMovieDetail);

router.post("/:table", (req, res) =>
  handlePost(req, res, req.params.table.toUpperCase())
);
router.get("/:table", (req, res) =>
  handleGet(req, res, req.params.table.toUpperCase())
);
router.put("/:table/:id", (req, res) =>
  handlePut(req, res, req.params.table.toUpperCase())
);
router.delete("/:table/:id", (req, res) =>
  handleDelete(req, res, req.params.table.toUpperCase())
);

module.exports = router;
