import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "http://localhost:3000").origin;
const type = { "Content-Type": "application/json" };
const payload = {
  title: "  QA network check  ",
  category: "Network",
  description: "  Demo record for the Activity 7 API check.  ",
  status: "Pending",
  id: 1000000
};

async function call(path, status, options) {
  const response = await fetch(base + path, { ...options, signal: AbortSignal.timeout(120000) });
  const text = await response.text();
  assert.equal(response.status, status, `${options?.method || "GET"} ${path}: ${text.slice(0, 400)}`);
  if (/application\/json/i.test(response.headers.get("content-type") || "")) {
    const data = JSON.parse(text);
    if (status >= 400) assert.equal(typeof data.message, "string");
    return data;
  }
  return text;
}

const write = (method, value) => ({method, headers:type, body:JSON.stringify(value)});
assert.match(await call("/", 200), /CampusPulse IT Support Desk API/);
assert.deepEqual(await call("/health", 200), {status:"ok", database:"ok"});
const records = await call("/api/records", 200);
assert.ok(Array.isArray(records));
assert.ok(records.every((record, index) => index === 0 || records[index - 1].id < record.id));
const { title, ...missingTitle } = payload;
await call("/api/records", 400, write("POST", missingTitle));
await call("/api/records", 400, write("POST", {...payload, title: "   "}));
await call("/api/records", 400, write("POST", {...payload, status: "Working"}));
await call("/api/records", 400, write("POST", {...payload, category: 12}));
await call("/api/records", 400, {method:"POST", headers:type, body:"{"});
await call("/api/records/0", 400);
await call("/api/records/3.5", 400);
await call("/api/records/9999999", 404);
await call("/api/records/9999999", 404, write("PUT", payload));
await call("/api/records/9999999", 404, {method:"DELETE"});
await call("/unknown", 404);
assert.equal((await call("/api/records", 200)).length, records.length);

const created = await call("/api/records", 201, write("POST", payload));
assert.ok(Number.isSafeInteger(created.id) && created.id > 0 && created.id !== payload.id);
assert.equal(created.title, payload.title.trim());
assert.equal(created.description, payload.description.trim());
const single = "/api/records/" + created.id;
try {
  assert.deepEqual(await call(single, 200), created);
  await call(single, 400, write("PUT", { title: "Incomplete update" }));
  assert.deepEqual(await call(single, 200), created);
  const updated = await call(single, 200, write("PUT", {...payload, title:"QA completed network check", status:"Completed"}));
  assert.equal(updated.id, created.id);
  assert.equal(updated.title, "QA completed network check");
  assert.equal(updated.status, "Completed");
  assert.deepEqual(await call(single, 200), updated);
} finally {
  assert.deepEqual(await call(single, 200, {method:"DELETE"}), {message:"Record deleted."});
}
await call(single, 404);
assert.equal((await call("/api/records", 200)).length, records.length);
console.log("Passed guide, health, every CRUD route, malformed JSON, field and ID validation, and missing routes/records.");
