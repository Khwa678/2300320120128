const logger = require('./logger');

function requestLogger(req, res, next) {
  const startTime = process.hrtime();
  const requestContext = {
    event: 'request.start',
    method: req.method,
    path: req.originalUrl || req.url,
    query: req.query,
  };

  logger.log(
    'requestLogger',
    'info',
    'logging_middleware',
    `Received ${req.method} ${req.originalUrl || req.url} and began lifecycle tracking`,
    requestContext
  );

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const elapsedMs = seconds * 1000 + nanoseconds / 1e6;
    const responseContext = {
      event: 'request.complete',
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: Number(elapsedMs.toFixed(2)),
    };

    if (res.statusCode >= 500) {
      logger.log(
        'requestLogger',
        'error',
        'logging_middleware',
        `Request finished with server error ${res.statusCode}`,
        responseContext
      );
    } else if (res.statusCode >= 400) {
      logger.log(
        'requestLogger',
        'warn',
        'logging_middleware',
        `Request finished with client warning/status ${res.statusCode}`,
        responseContext
      );
    } else {
      logger.log(
        'requestLogger',
        'success',
        'logging_middleware',
        `Request finished successfully in ${Number(elapsedMs.toFixed(2))}ms`,
        responseContext
      );
    }
  });

  next();
}

module.exports = requestLogger;
