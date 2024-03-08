const winston = require("winston");
const expressWinston = require("express-winston");

module.exports = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
  format: winston.format.combine(
    winston.format.json()
  ),
});
