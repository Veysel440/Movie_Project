const express = require("express");
const cors = require("cors");
const winston = require("winston");
const routes = require("./routes");
const db = require("./db");
const config = require("./config");
const { logErrorToDB } = require("./services/loggerService");
require("dotenv").config();

const app = express();

// Winston Logger
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

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

db.setLogger(logger);

app.use("/api", routes);

app.use(async (req, res) => {
  const message = `${req.method} ${req.url} - 404 Not Found`;
  logger.error(message);

  await logErrorToDB("404_HANDLER", message, null, "low");

  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

app.use(async (err, req, res, next) => {
  const message = `${req.method} ${req.url} - ERROR: ${err.message}`;

  logger.error(message, { stack: err.stack });

  await logErrorToDB("GLOBAL_ERROR_HANDLER", err.message, err.stack, "high");

  res
    .status(err.status || 500)
    .json({ success: false, error: err.message || "Internal Server Error" });
});

async function startServer() {
  try {
    await db.initializePool();
    const PORT = process.env.PORT || 3005;
    app.listen(PORT, () => {
      logger.info(`Register server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Server başlatılamadı:", {
      message: error.message,
      stack: error.stack,
    });

    await logErrorToDB("SERVER_START", error.message, error.stack, "high");

    process.exit(1);
  }
}

startServer();
