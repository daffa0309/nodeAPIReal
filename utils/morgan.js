const morgan = require('morgan');

const { logger } = require('./winston');

morgan.token('id', (req) => {
  return req.headers['request-id'];
});

module.exports = morgan(
  ':id :remote-addr [:date[clf]] :method :url' +
    ' HTTP/:http-version :status :res[content-length]' +
    ' :response-time ms :user-agent',
  { stream: logger.stream },
);
