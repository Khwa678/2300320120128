const http = require('http');
const https = require('https');
const { URL } = require('url');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  success: 3,
  debug: 4,
};

const defaultLevel = process.env.LOG_LEVEL || 'debug';
const currentLevel = levels[defaultLevel] ?? levels.debug;
const TEST_LOG_URL = process.env.TEST_LOG_URL || 'http://localhost:4200/log';

function shouldLog(level) {
  return levels[level] <= currentLevel;
}

function formatLogEntry(stack, level, packageName, message, context = {}) {
  return {
    timestamp: new Date().toISOString(),
    stack,
    level,
    package: packageName,
    message,
    context,
  };
}

function postLogToServer(payload) {
  try {
    const url = new URL(TEST_LOG_URL);
    const body = JSON.stringify(payload);
    const client = url.protocol === 'https:' ? https : http;

    const req = client.request(
      {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 2000,
      },
      (res) => {
        res.on('data', () => {});
      }
    );

    req.on('error', () => {});
    req.on('timeout', () => req.destroy());
    req.write(body);
    req.end();
  } catch (error) {
    console.error('Failed to send log to test server:', error.message);
  }
}

function log(stack, level, packageName, message, context = {}) {
  if (!shouldLog(level)) return;
  const entry = formatLogEntry(stack, level, packageName, message, context);
  const serialized = JSON.stringify(entry);

  if (level === 'error') {
    console.error(serialized);
  } else {
    console.log(serialized);
  }

  postLogToServer(entry);
}

module.exports = {
  log,
  error: (stack, packageName, message, context) => log(stack, 'error', packageName, message, context),
  warn: (stack, packageName, message, context) => log(stack, 'warn', packageName, message, context),
  info: (stack, packageName, message, context) => log(stack, 'info', packageName, message, context),
  success: (stack, packageName, message, context) => log(stack, 'success', packageName, message, context),
  debug: (stack, packageName, message, context) => log(stack, 'debug', packageName, message, context),
};
