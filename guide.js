const routes = [
  ["GET", "/", "API guide", "200"],
  ["GET", "/health", "Server and database check", "200"],
  ["GET", "/api/records", "List all records", "200"],
  ["GET", "/api/records/:id", "Read one record", "200"],
  ["POST", "/api/records", "Create a record", "201"],
  ["PUT", "/api/records/:id", "Replace all four editable fields", "200"],
  ["DELETE", "/api/records/:id", "Delete a record", "200"]
];

function renderGuide(baseUrl) {
  const url = String(baseUrl).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const rows = routes.map(([method, path, purpose, status]) =>
    `<tr><td><strong>${method}</strong></td><td><code>${path}</code></td><td>${purpose}</td><td>${status}</td></tr>`
  ).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CampusPulse IT Support Desk API</title>
<style>
:root{font-family:system-ui,sans-serif;color:#252340;background:#eef5ff;line-height:1.55}
body{margin:0}main{width:min(62rem,calc(100% - 2rem));margin:1.5rem auto 3rem}
header{background:#142a50;color:#fff;border-radius:1rem;padding:clamp(1.1rem,4vw,2rem)}
h1,h2{line-height:1.2}h1{margin:.35rem 0 .75rem;font-size:clamp(1.8rem,5vw,3rem)}
header p{margin:.4rem 0}section{background:white;border:1px solid #d2dfee;border-radius:.9rem;margin-top:1rem;padding:1rem 1.25rem}
section h2{margin:.25rem 0 .8rem}.table-wrap{overflow:auto}
table{border-collapse:collapse;width:100%;text-align:left}th,td{padding:.55rem;border-bottom:1px solid #d2dfee}th{background:#eef5ff}
pre{overflow:auto;padding:1rem;border-radius:.5rem;background:#e8f1ff}a{color:#124f9b}header a{color:#c4e3ff}
.base{overflow-wrap:anywhere}:focus-visible{outline:3px solid #8a70eb;outline-offset:3px}
</style>
</head>
<body>
<main>
<header>
  <p>ICT251 · Activity 7 · Student number 202512781</p>
  <h1>CampusPulse IT Support Desk API</h1>
  <p>Use this API to create and track demonstration tickets for network, hardware, software, and account issues.</p>
  <p class="base">API base URL <code>${url}</code></p>
  <p><a href="/health">Check database health</a> · <a href="/api/records">View all records</a> · <a href="/api/records/1">View sample record</a></p>
</header>
<section aria-labelledby="routes">
  <h2 id="routes">Routes</h2>
  <div class="table-wrap"><table>
    <thead><tr><th scope="col">Method</th><th scope="col">Path</th><th scope="col">Purpose</th><th scope="col">Success</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
</section>
<section aria-labelledby="body">
  <h2 id="body">POST and PUT body</h2>
  <p>Send all four fields as strings with <code>Content-Type: application/json</code>. The database generates the ID. For PUT, include an existing positive whole-number ID in the URL.</p>
  <ul><li><code>title</code> · 3–80 characters</li><li><code>category</code> · 2–40 characters</li><li><code>description</code> · 5–300 characters</li><li><code>status</code> · Pending, In progress, or Completed</li></ul>
  <pre><code>{
  "title": "Wi-Fi drop in Computer Lab 2",
  "category": "Network",
  "description": "The campus Wi-Fi disconnects during lab sessions.",
  "status": "Pending"
}</code></pre>
  <p>Use an API client for write requests. Create a sample record, then use its returned ID for PUT and DELETE.</p>
</section>
<section aria-labelledby="responses">
  <h2 id="responses">Responses</h2>
  <p>GET all returns an array. GET one, POST and PUT return a record with its ID. DELETE returns <code>{"message":"Record deleted."}</code>.</p>
  <p>Errors return JSON with a <code>message</code> field. <strong>400</strong> means invalid input or JSON, <strong>404</strong> means a missing route or record, <strong>500</strong> means an unexpected server error, and <strong>503</strong> means the health check could not reach the database.</p>
  <p>An idle service may take a moment to start.</p>
</section>
</main>
</body>
</html>`;
}

module.exports = { renderGuide };
