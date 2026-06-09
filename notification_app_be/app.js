const express = require('express');
const requestLogger = require('./requestLogger');
const errorHandler = require('./errorHandler');
const logger = require('./logger');

const app = express();
app.use(express.json());

const EVALUATION_LOG_API_KEY = process.env.EVALUATION_LOG_API_KEY || 'default-eval-key';
const allowedLogLevels = ['debug', 'info', 'warn', 'error', 'success'];
const allowedStacks = ['frontend', 'backend'];
const allowedPackages = ['cache', 'controller', 'cron job', 'db', 'domain', 'handler'];

function allowCors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Request-Id, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    logger.log(
      'app',
      'debug',
      'notification_app_be',
      'Handled CORS preflight request during startup handshake',
      {
        event: 'cors.preflight',
        method: req.method,
        path: req.path,
      }
    );
    return res.sendStatus(204);
  }
  next();
}

function requireEvaluationLogAuth(req, res, next) {
  const authHeader = req.get('Authorization');
  const apiKeyHeader = req.get('X-API-KEY');
  if (!authHeader && !apiKeyHeader) {
    logger.log(
      'evaluationService',
      'warn',
      'notification_app_be',
      'Missing authorization header for evaluation log route',
      {
        event: 'evaluationService.auth.missing',
        path: req.path,
        source: req.ip,
      }
    );
    return res.status(401).json({ error: 'Authorization header or X-API-KEY is required' });
  }

  const token = (authHeader || '').replace(/^Bearer\s+/i, '') || apiKeyHeader;
  if (token !== EVALUATION_LOG_API_KEY) {
    logger.log(
      'evaluationService',
      'warn',
      'notification_app_be',
      'Invalid authorization token for evaluation log route',
      {
        event: 'evaluationService.auth.invalid',
        path: req.path,
        source: req.ip,
      }
    );
    return res.status(401).json({ error: 'Invalid authorization token' });
  }
  next();
}

function validateEvaluationLogPayload(payload) {
  const errors = [];
  if (!payload.stack || !allowedStacks.includes(payload.stack)) {
    errors.push(`stack must be one of: ${allowedStacks.join(', ')}`);
  }
  if (!payload.level || !allowedLogLevels.includes(payload.level)) {
    errors.push(`level must be one of: ${allowedLogLevels.join(', ')}`);
  }
  if (!payload.package || !allowedPackages.includes(payload.package)) {
    errors.push(`package must be one of: ${allowedPackages.join(', ')}`);
  }
  if (!payload.message || typeof payload.message !== 'string') {
    errors.push('message is required and must be a string');
  }
  return errors;
}

app.use(allowCors);
app.use(requestLogger);

app.get('/health', (req, res) => {
  logger.log(
    'app',
    'info',
    'notification_app_be',
    'Health endpoint processed successfully',
    {
      event: 'health.check',
      requestId: req.requestId,
    }
  );
  res.json({ status: 'ok', requestId: req.requestId });
});

app.get('/notifications', (req, res) => {
  const notifications = [
    { id: 1, message: 'Reminder: standup at 10am', severity: 'info' },
    { id: 2, message: 'Payment overdue alert', severity: 'warn' },
  ];

  logger.log(
    'app',
    'info',
    'notification_app_be',
    'Notification list returned to caller',
    {
      event: 'notifications.list',
      requestId: req.requestId,
      count: notifications.length,
    }
  );

  res.json({ notifications, requestId: req.requestId });
});

app.post('/evaluation-service/logs', requireEvaluationLogAuth, (req, res) => {
  const payload = req.body;
  const validationErrors = validateEvaluationLogPayload(payload);
  if (validationErrors.length) {
    logger.log(
      'evaluationService',
      'warn',
      'notification_app_be',
      'Evaluation log payload validation failed',
      {
        event: 'evaluationService.validation',
        requestId: req.requestId,
        errors: validationErrors,
        payload,
      }
    );
    return res.status(400).json({
      error: 'Invalid log payload',
      details: validationErrors,
    });
  }

  const evaluationContext = {
    event: 'evaluationService.log',
    requestId: req.requestId,
    stack: payload.stack,
    package: payload.package,
    source: payload.stack,
    category: payload.package,
    extra: payload.context || {},
  };

  logger.log(
    'evaluationService',
    payload.level,
    payload.package,
    payload.message,
    evaluationContext
  );

  res.status(201).json({
    status: 'accepted',
    log: {
      stack: payload.stack,
      level: payload.level,
      package: payload.package,
      message: payload.message,
    },
  });
});

app.post('/notifications', (req, res) => {
  const payload = req.body;
  if (!payload || !payload.message) {
    logger.log(
      'app',
      'warn',
      'notification_app_be',
      'Notification creation request failed validation because message was missing',
      {
        event: 'notifications.create.validation',
        requestId: req.requestId,
        payload,
      }
    );
    return res.status(400).json({
      error: 'message is required',
      requestId: req.requestId,
    });
  }

  const created = {
    id: Date.now(),
    message: payload.message,
    severity: payload.severity || 'info',
    createdAt: new Date().toISOString(),
  };

  logger.log(
    'app',
    'success',
    'notification_app_be',
    'Notification created and persisted in memory',
    {
      event: 'notifications.create',
      requestId: req.requestId,
      notificationId: created.id,
      severity: created.severity,
    }
  );

  res.status(201).json({ notification: created, requestId: req.requestId });
});

app.get('/notifications/error', (req, res) => {
  throw new Error('Simulated backend failure for logging verification');
});

app.use(errorHandler);

const port = process.env.PORT || 4100;
app.listen(port, () => {
  logger.log('app', 'info', 'notification_app_be', 'Notification backend started and listening for requests', {
    event: 'server.start',
    port,
  });
});
