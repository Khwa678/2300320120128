const express = require('express');
const requestLogger = require('./requestLogger');
const errorHandler = require('./errorHandler');
const logger = require('./logger');

const app = express();
app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
  logger.log(
    'app',
    'info',
    'logging_middleware',
    'Health endpoint responded successfully',
    { event: 'health.check' }
  );
  res.json({ status: 'ok' });
});

app.get('/notifications', (req, res) => {
  const notifications = [
    { id: 1, message: 'Notification created', severity: 'info' },
    { id: 2, message: 'System alert generated', severity: 'warn' },
  ];

  logger.log(
    'app',
    'info',
    'logging_middleware',
    `Returning ${notifications.length} notifications to caller`,
    { event: 'notifications.list', count: notifications.length }
  );
  res.json({ notifications });
});

app.post('/notifications', (req, res) => {
  const payload = req.body;
  if (!payload || !payload.message) {
    logger.log(
      'app',
      'warn',
      'logging_middleware',
      'Notification creation request rejected because message was missing',
      { event: 'notifications.create.validation', payload }
    );
    return res.status(400).json({ error: 'message is required' });
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
    'logging_middleware',
    'Created notification successfully and returned payload to client',
    { event: 'notifications.create', notificationId: created.id, severity: created.severity }
  );
  res.status(201).json({ id: created.id, ...payload });
});

app.get('/error', (req, res) => {
  throw new Error('Simulated failure for logging verification');
});

app.use(errorHandler);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  logger.log('app', 'info', 'logging_middleware', 'Logging middleware sample app started', { port });
  console.log(`Logging middleware sample app listening on port ${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Set PORT to a different value or stop the process using this port.`);
  } else {
    console.error('Server failed to start:', err);
  }
  process.exit(1);
});
