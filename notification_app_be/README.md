# Notification Backend

This backend demonstrates lifecycle-aware logging for notification operations.

## Features

- Structured JSON logs for all lifecycle events
- Request IDs for tracing across logs
- Success, warning, info, and error log levels
- Request duration and status tracking
- Error handler that logs exceptions and returns a safe API response

## Run

1. Install dependencies:
   ```bash
   cd "notification_app_be"
   npm install
   ```

2. Start the backend:
   ```bash
   npm start
   ```

3. Test endpoints:
   - `GET /health`
   - `GET /notifications`
   - `POST /notifications` with `{ "message": "..." }`
   - `POST /evaluation-service/logs` with a protected structured log payload
   - `GET /notifications/error` to verify error logging

4. Open the frontend sample from `notification_app_fe/index.html` and use the UI buttons to drive the API.

### Evaluation service logs endpoint

- `POST /evaluation-service/logs`
- Requires header `Authorization: Bearer default-eval-key` or `X-API-KEY: default-eval-key`
- Body fields:
  - `stack`: `frontend` or `backend`
  - `level`: `debug`, `info`, `warn`, `error`, or `success`
  - `package`: `cache`, `controller`, `cron job`, `db`, `domain`, or `handler`
  - `message`: string
  - `context`: optional object with additional data

## Customization

Set `LOG_LEVEL` to filter logs. Example:

```bash
LOG_LEVEL=info npm start
```

Set `TEST_LOG_URL` to point logs at a remote test server. Example:

```bash
TEST_LOG_URL=http://localhost:4200/log npm start
```
