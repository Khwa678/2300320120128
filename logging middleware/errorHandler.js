const logger = require('./logger');

function errorHandler(err, req, res, next) {
  const errorContext = {
    event: 'request.error',
    method: req.method,
    path: req.originalUrl || req.url,
    statusCode: err.status || 500,
    message: err.message,
    stack: err.stack,
  };

  logger.log(
    'errorHandler',
    'error',
    'logging_middleware',
    'Caught an unhandled exception while processing the request',
    errorContext
  );

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
}

module.exports = errorHandler;
