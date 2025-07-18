const { executeSQL } = require("../services/oracleService");

function extractSlugFromLink(link) {
  if (!link) return null;
  const parts = link.split("/");
  return parts[parts.length - 1];
}

async function handlePendingRatings(req, res) {
  const { LINK, EMAIL, COMMENT, RATING, TYPE } = req.body;

  console.log(">>> Gelen BODY:", req.body);

  if (!LINK || !EMAIL || !RATING || !TYPE) {
    return res.status(400).json({ success: false, message: "Eksik veri var!" });
  }

  try {
    const table =
      TYPE === "series" ? "SERIES_RATINGS_COMMENTS" : "MOVIE_RATINGS_COMMENTS";

    const insertSQL = `
      INSERT INTO "${table}" ("LINK", "EMAIL", "COMMENT_TEXT", "RATING")
      VALUES (:link, :email, :comment_text, :rating)
    `;

    await executeSQL(insertSQL, {
      link: LINK,
      email: EMAIL,
      comment_text: COMMENT || "",
      rating: RATING,
    });

    return res
      .status(201)
      .json({ success: true, message: "Yorum kaydedildi." });
  } catch (error) {
    console.error("handlePendingRatings HATASI:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { handlePendingRatings };
