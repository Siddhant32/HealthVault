# Live Copilot setup

The demo Copilot now sends questions to the HealthVault backend for a real
Gemini response. The Gemini key stays on the backend and must never be added to
the frontend or a `VITE_` variable.

## Local development with live Copilot only

MongoDB is not required for demo login or Copilot. To run that mode:

1. Copy `Backend/.env.example` to `Backend/.env` and set `GEMINI_API_KEY`.
2. Start the backend from `Backend` with `npm install` and `npm run dev`.
3. Start the frontend from `frontend` with `npm run dev` and sign in with the
   demo credentials shown on the login page.

The backend starts if `MONGO_URI` is missing or its database cannot be reached.
Copilot works with the demo account; signup, regular login, profiles, records,
sharing, and doctor search return a clear `503` response until MongoDB is
connected and `JWT_SECRET` is configured.

## Local development with all database-backed features

1. Start MongoDB.
2. Copy `Backend/.env.example` to `Backend/.env` and set `MONGO_URI`,
   `JWT_SECRET`, and `GEMINI_API_KEY` there. Keep `Backend/.env` private.
3. From `Backend`, run `npm install` and `npm run dev`.
4. From `frontend`, run `npm run dev` and sign in with the demo credentials
   shown on the login page. Vite forwards `/api` requests to the backend on
   port 5000.

## Vercel frontend with a separately hosted backend

1. Deploy the backend and set `GEMINI_API_KEY` as a private environment
   variable on the backend host. MongoDB is optional for demo Copilot. Add
   `MONGO_URI` and `JWT_SECRET` only if you also want database-backed account
   and health-data features.
2. In the Vercel project settings for the frontend, set
   `VITE_API_BASE_URL` to the backend API URL, including `/api` (for example,
   `https://your-backend.example.com/api`).
3. Redeploy the frontend after setting `VITE_API_BASE_URL`.

The demo's profile, records, doctor search, and sharing requests continue to
use the browser mock API. Only Copilot requests go to the backend. Demo
Copilot requests send the question and a limited copy of the saved health
profile and up to 20 records to the backend for the Gemini response. The demo
endpoint is limited to 12 requests per minute per client IP. Do not use real
patient information in the public demo.
