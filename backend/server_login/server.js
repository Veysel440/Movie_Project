const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const winston = require("winston");

const { initializePool } = require("./db");
const { server: serverConfig } = require("./config");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

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

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: serverConfig.corsOrigin, credentials: true }));
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api", routes);

app.use((req, res) =>
  res.status(404).json({ success: false, message: "Not Found" })
);

app.use(errorHandler);

(async () => {
  try {
    await initializePool();
    app.listen(serverConfig.port, () => {
      logger.info(`Server listening on port ${serverConfig.port}`);
    });
  } catch (err) {
    logger.error("Server başlatılamadı:", err);
    process.exit(1);
  }
})();
