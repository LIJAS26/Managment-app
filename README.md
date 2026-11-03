# Northstar authentication demo

## Run locally

Start the JSON Server API:

```sh
npm run server
```

In another terminal, start the Vite app:

```sh
npm run dev
```

The API listens on `http://localhost:3002`. Set `VITE_API_URL` to use a different API URL.

## Demo account

- Email: `john@example.com`
- Password: `password123`

New registrations are written to `db.json`.

The demo also includes a show-password control, remember-me choice, dark-mode toggle, profile photo preview, toast messages, and simulated email verification and password reset. Reset messages are not actually emailed, and uploaded photos are only previewed in the browser.

This is a local learning demo, not production authentication. JSON Server stores passwords in plaintext and has no real authorization or secure session management. Use a proper backend, password hashing, and secure server-side sessions before deploying.
