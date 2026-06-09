# Notification App Frontend

This is a minimal frontend that calls the notification backend at `http://localhost:4100`.

## Run

1. Start the backend in `notification_app_be`:
   ```bash
   cd "notification_app_be"
   npm start
   ```

2. Start the frontend server in `notification_app_fe`:
   ```bash
   cd "notification_app_fe"
   npm start
   ```

3. Open `http://localhost:4300` in a browser.

4. Use the buttons to:
   - run a health check
   - fetch notification list
   - create a new notification
   - simulate a backend error
   - send a protected evaluation log to the backend using `Bearer default-eval-key`

## Notes

- The frontend server uses Node built-in modules, so no extra dependencies are required.

## Notes

- The backend is configured to allow CORS from any origin.
- You can also serve the frontend via a local static server if preferred.
