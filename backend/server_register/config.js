require("dotenv").config();

module.exports = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "mySuperSecretKey",
    expiresIn: process.env.JWT_EXPIRES_IN || "12h",
    cookieMaxAge: 12 * 60 * 60 * 1000,
  },
  bcrypt: {
    saltRounds: 10,
  },
};
