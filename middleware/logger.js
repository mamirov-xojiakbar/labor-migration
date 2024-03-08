const winston = require("winston");
const expressWinston = require("express-winston");

module.exports = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: "combine.log",
      level: "info",
    }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.metadata()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return false;
  },
});
