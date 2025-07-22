const logRepository = require("../repositories/logRepository");
const { logErrorToDB } = require("../services/loggerService");

exports.getLogs = async (req, res) => {
  try {
    const severity = req.query.severity || null;
    const logs = await logRepository.getLogs(severity);

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error("Logları çekme hatası:", error.message);

    await logErrorToDB(
      "logController.getLogs",
      error.message,
      error.stack,
      "mid"
    );

    res.status(500).json({ success: false, message: "Logları çekme hatası." });
  }
};
