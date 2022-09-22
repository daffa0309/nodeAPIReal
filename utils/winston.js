require('dotenv').config();

const fs = require('fs');
const path = require('path');

const winston = require('winston');
require('winston-daily-rotate-file');

const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const rotatingFileTransport = new (winston.transports.DailyRotateFile)({
  filename: path.join(logsDir, 'info-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: 7,
});

const transports = [];
if (process.env.NODE_ENV === 'development') {
  transports.push(new winston.transports.Console());
}
if (process.env.NODE_ENV === 'production') {
  transports.push(rotatingFileTransport);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.logstash(),
  defaultMeta: { service: 'nodeJS-api' },
  transports,
});

logger.stream = {
  write: (message, _) => {
    logger.info(message);
  },
};

module.exports = {
  logger,
};
