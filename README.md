# CampusPulse IT Support Desk
ICT251 Activity 7 · Student number 202512781

Independent Node.js and Express API with the same ticket fields and eight demonstration tickets as CampusPulse Activity 6. SQLite stores records in a local file during development. On Render, use a hosted SQLite database through Turso. The schema and demonstration tickets initialize automatically on the first start, and deleting a ticket does not cause it to reappear after a restart.

## Run locally

Use Node.js 24. Run these commands from this folder.

```text
npm install
npm start
```

Open http://localhost:3000 for the API guide and http://localhost:3000/health for the database check. The default local database file is `data/records.sqlite`.

## Deploy through GitHub and Render

1. Push this folder to the GitHub repository, including `package.json` and `package-lock.json`. Git ignores installed dependencies, local databases and environment files.
2. In Turso, create a separate SQLite database for CampusPulse and generate a database token with read and write access.
3. In Render, create a **Web Service** from the GitHub repository using these settings.

| Render field | Value |
| --- | --- |
| Runtime | Node |
| Root Directory | `activity7-backend` if the repository contains that folder. Leave blank if the repository starts at `package.json`. |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free, if available |
| Health Check Path | `/health` |
| Environment | `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` from Turso |

Set the database values in Render's Environment tab. Keep the token out of GitHub. Render supplies the service port and public base URL. Set `CLIENT_ORIGINS` to the Activity 8 frontend origin when integrating it. An API client such as Postman can call the API without that setting.

Open the assigned HTTPS URL and `/health`, then test GET all, POST, GET by returned ID, PUT, and DELETE. Use a temporary ticket and verify its removal. Submit the public Render base URL, which opens the guide. A free service may take a moment to start.

## Check every endpoint

Leave the API running and open a second terminal in this folder. Run `npm run check:api` locally or `npm run check:api -- https://YOUR-SERVICE.onrender.com` for the live service. The check creates and removes its own temporary ticket, exercises input validation and confirms the key response codes. To check persistence separately, create a temporary ticket, restart the service, fetch that ticket by ID, then delete it.
