require("dotenv").config();

module.exports = {
  server: {
    port: process.env.PORT || 3002,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "superSecretKey",
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  },
  cookie: {
    name: "token",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 2 * 60 * 60 * 1000,
  },
};
