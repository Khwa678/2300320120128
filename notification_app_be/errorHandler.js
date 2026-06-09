const logger = require('./logger');

function errorHandler(err, req, res, next) {
  const errorContext = {
    event: 'request.error',
    requestId: res.locals.requestId || null,
    method: req.method,
    path: req.originalUrl || req.url,
    statusCode: err.status || 500,
    message: err.message,
    stack: err.stack,
  };

  logger.log(
    'errorHandler',
    'error',
    'notification_app_be',
    'Unhandled exception caught in request pipeline',
    errorContext
  );

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    requestId: res.locals.requestId || undefined,
  });
}

module.exports = errorHandler;
