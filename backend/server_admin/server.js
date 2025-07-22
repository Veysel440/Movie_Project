const express = require("express");
const cors = require("cors");
const winston = require("winston");
const routes = require("./routes");
const db = require("./db");
const { logErrorToDB } = require("./services/loggerService");
require("dotenv").config();

const app = express();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/api", routes);

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

app.use(async (err, req, res, next) => {
  logger.error(err.stack);
  await logErrorToDB("globalMiddleware", err.message, err.stack, "high");
  res.status(500).json({ error: err.message || "Sunucu hatası" });
});

db.setLogger(logger);

async function startServer() {
  try {
    await db.initializePool();
    app.listen(3001, () => {
      logger.info("Admin server running on port 3001");
    });
  } catch (err) {
    logger.error("Server başlatılamadı:", err);
    await logErrorToDB("startServer", err.message, err.stack, "high");
    process.exit(1);
  }
}

startServer();
