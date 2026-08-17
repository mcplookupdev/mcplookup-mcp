import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  CANONICAL_ENDPOINT,
  PACKAGE_VERSION,
  parseEventStream,
  relayLine,
  relayMessage,
} from "../src/relay.js";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

test("parses JSON messages from Streamable HTTP events", () => {
  assert.deepEqual(
    parseEventStream('event: message\ndata: {"jsonrpc":"2.0","id":1,"result":{"ok":true}}\n\n'),
    [{ jsonrpc: "2.0", id: 1, result: { ok: true } }],
  );
});

test("forwards the MCP message unchanged to the canonical endpoint", async () => {
  const request = { jsonrpc: "2.0", id: 7, method: "tools/list", params: {} };
  let captured;
  const responses = await relayMessage(request, {
    fetchFn: async (url, init) => {
      captured = { url, init };
      return new Response(JSON.stringify({ jsonrpc: "2.0", id: 7, result: { tools: [] } }), {
        headers: { "content-type": "application/json" },
      });
    },
  });

  assert.equal(captured.url, CANONICAL_ENDPOINT);
  assert.deepEqual(JSON.parse(captured.init.body), request);
  assert.equal(captured.init.headers["content-type"], "application/json");
  assert.equal(PACKAGE_VERSION, packageJson.version);
  assert.equal(captured.init.headers["user-agent"], `mcplookup-mcp/${packageJson.version}`);
  assert.deepEqual(responses, [{ jsonrpc: "2.0", id: 7, result: { tools: [] } }]);
});

test("a successful notification produces no stdio response", async () => {
  const responses = await relayMessage(
    { jsonrpc: "2.0", method: "notifications/initialized" },
    { fetchFn: async () => new Response(null, { status: 202 }) },
  );
  assert.deepEqual(responses, []);
});

test("HTTP rate limits become protocol errors for stdio clients", async () => {
  const responses = await relayMessage(
    { jsonrpc: "2.0", id: "limited", method: "tools/list" },
    {
      fetchFn: async () => new Response("Too Many Requests", {
        status: 429,
        headers: { "retry-after": "60" },
      }),
    },
  );
  assert.deepEqual(responses, [{
    jsonrpc: "2.0",
    id: "limited",
    error: {
      code: -32000,
      message: "Remote MCP request failed with HTTP 429",
      data: { httpStatus: 429, retryAfter: "60" },
    },
  }]);
});

test("malformed stdio input returns the JSON-RPC parse error", async () => {
  const output = [];
  await relayLine("not json", { write: (value) => output.push(JSON.parse(value)) });
  assert.deepEqual(output, [{
    jsonrpc: "2.0",
    id: null,
    error: { code: -32700, message: "Parse error" },
  }]);
});
