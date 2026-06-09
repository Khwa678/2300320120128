# Logging Middleware Sample

This folder contains a minimal Express app that demonstrates robust lifecycle logging for successful operations, warnings, informational events, debugging details, and exceptions.

## Features

- `logger.js` provides structured, JSON-formatted log entries.
- `requestLogger.js` captures request start, completion, status codes, and duration.
- `errorHandler.js` logs full error context and returns a safe 500 response.
- `app.js` shows endpoint-level logging for normal flows, validation warnings, and simulated failures.

## Run

1. Install dependencies:
   ```bash
   cd "logging middleware"
   npm install
   ```

2. Start the sample app:
   ```bash
   npm start
   ```

3. Exercise endpoints:
   - `GET /health`
   - `GET /notifications`
   - `POST /notifications` with JSON `{ "message": "..." }`
   - `GET /error` to verify error logging

## Log Levels

- `error` — critical failures and unhandled exceptions
- `warn` — client validation issues and non-fatal warnings
- `info` — application lifecycle events and operational metadata
- `success` — completed operations and success states
- `debug` — detailed messages for troubleshooting and diagnostics

## Customization

Set `LOG_LEVEL` to control the minimum log level emitted. Example:

```bash
LOG_LEVEL=info npm start
```

Set `TEST_LOG_URL` to forward logs to a remote test server with each call. Example:

```bash
TEST_LOG_URL=http://localhost:4200/log npm start
```
