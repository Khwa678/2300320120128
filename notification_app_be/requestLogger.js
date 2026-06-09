const logger = require('./logger');
const { randomUUID } = require('crypto');

function requestLogger(req, res, next) {
  const requestId = req.get('X-Request-Id') || randomUUID();
  res.locals.requestId = requestId;
  req.requestId = requestId;

  const startTime = process.hrtime();
  const requestContext = {
    event: 'request.start',
    requestId,
    method: req.method,
    path: req.originalUrl || req.url,
    ip: req.ip,
    query: req.query,
    userAgent: req.headers['user-agent'],
  };

  logger.log(
    'requestLogger',
    'info',
    'notification_app_be',
    `Started handling ${req.method} ${req.originalUrl || req.url}`,
    requestContext
  );

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationMs = seconds * 1000 + nanoseconds / 1e6;
    const responseContext = {
      event: 'request.complete',
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    };

    if (res.statusCode >= 500) {
      logger.log(
        'requestLogger',
        'error',
        'notification_app_be',
        `Request ended in failure with status ${res.statusCode}`,
        responseContext
      );
    } else if (res.statusCode >= 400) {
      logger.log(
        'requestLogger',
        'warn',
        'notification_app_be',
        `Request ended with client warning status ${res.statusCode}`,
        responseContext
      );
    } else {
      logger.log(
        'requestLogger',
        'success',
        'notification_app_be',
        `Request completed successfully in ${Number(durationMs.toFixed(2))}ms`,
        responseContext
      );
    }
  });

  next();
}

module.exports = requestLogger;
