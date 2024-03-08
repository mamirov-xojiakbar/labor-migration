const { createLogger, format, transports } = require("winston");
const { combine, timestamp, prettyPrint, printf, json, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "log/combine.log", level: "info" }),
  ],
});

module.exports = logger;
