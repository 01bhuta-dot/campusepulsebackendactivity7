require("dotenv").config({ quiet: true });
const { createApp } = require("./app");
const { openDatabase } = require("./db");
const { openHostedDatabase } = require("./hosted-db");

async function start() {
  const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, RENDER } = process.env;
  if (RENDER === "true" && (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN)) {
    throw new Error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to the project's hosted SQLite database.");
  }

  const port = Number(process.env.PORT || 3000);
  const database = TURSO_DATABASE_URL
    ? await openHostedDatabase(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
    : openDatabase(process.env.DATABASE_PATH);
  const app = createApp(database, {
    baseUrl: process.env.API_BASE_URL || process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`,
    clientOrigins: process.env.CLIENT_ORIGINS
  });
  app.listen(port, "0.0.0.0", () => console.log(`API listening on port ${port}`));
}

start().catch(error => {
  console.error("API startup failed:", error.message);
  process.exitCode = 1;
});
