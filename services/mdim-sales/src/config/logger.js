const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, errors } = format;
require("winston-daily-rotate-file");

// custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

// rotating file transport
const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d", // keep 14 days of logs
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    fileRotateTransport,
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
