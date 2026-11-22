const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { createClient } = require("@libsql/client");

function statements(filename) {
  return readFileSync(join(__dirname, filename), "utf8")
    .trim().split(/;\s*(?:\n|$)/).filter(Boolean);
}

async function openHostedDatabase(url, authToken) {
  const client = createClient({ url, authToken });
  try {
    // The schema and guarded seed statements initialize a new database together.
    await client.batch([...statements("schema.sql"), ...statements("seed.sql")], "write");
  } catch (error) {
    client.close();
    throw error;
  }

  return {
    async all(sql, ...args) {
      return (await client.execute({ sql, args })).rows;
    },
    async first(sql, ...args) {
      return (await client.execute({ sql, args })).rows[0];
    }
  };
}

module.exports = { openHostedDatabase };
