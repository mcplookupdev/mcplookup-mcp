import { createInterface } from "node:readline";

export const CANONICAL_ENDPOINT = "https://mcplookup.com/mcp";
export const PACKAGE_VERSION = "0.1.1";
const MAX_RESPONSE_BYTES = 256 * 1024;
const REQUEST_TIMEOUT_MS = 20_000;

function requestId(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return null;
  return typeof message.id === "string" || typeof message.id === "number"
    ? message.id
    : null;
}

function protocolError(id, message, data) {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code: -32000,
      message,
      ...(data ? { data } : {}),
    },
  };
}

export function parseEventStream(text) {
  const messages = [];
  let data = [];

  const flush = () => {
    if (data.length === 0) return;
    const value = data.join("\n");
    data = [];
    if (value === "[DONE]") return;
    messages.push(JSON.parse(value));
  };

  for (const line of text.split(/\r?\n/)) {
    if (line === "") {
      flush();
    } else if (line.startsWith("data:")) {
      data.push(line.slice(5).trimStart());
    }
  }
  flush();
  return messages;
}

async function boundedResponseText(response) {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_RESPONSE_BYTES) {
    await response.body?.cancel();
    throw new Error("Remote MCP response exceeded 256 KB");
  }

  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error("Remote MCP response exceeded 256 KB");
    }
    chunks.push(value);
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

export async function relayMessage(message, options = {}) {
  const fetchFn = options.fetchFn ?? globalThis.fetch;
  const endpoint = options.endpoint ?? CANONICAL_ENDPOINT;
  const id = requestId(message);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? REQUEST_TIMEOUT_MS);

  try {
    const response = await fetchFn(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
        "user-agent": `mcplookup-mcp/${PACKAGE_VERSION}`,
      },
      body: JSON.stringify(message),
      signal: controller.signal,
    });

    if (response.status === 202 || response.status === 204) return [];
    const text = await boundedResponseText(response);

    if (!response.ok) {
      if (id === null) return [];
      return [protocolError(id, `Remote MCP request failed with HTTP ${response.status}`, {
        httpStatus: response.status,
        retryAfter: response.headers.get("retry-after"),
      })];
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("text/event-stream")) return parseEventStream(text);
    if (contentType.includes("application/json")) return text ? [JSON.parse(text)] : [];
    throw new Error(`Remote MCP returned unsupported content type: ${contentType || "unknown"}`);
  } catch (error) {
    if (id === null) throw error;
    const timedOut = error instanceof Error && error.name === "AbortError";
    return [protocolError(id, timedOut ? "Remote MCP request timed out" : "Remote MCP request failed")];
  } finally {
    clearTimeout(timer);
  }
}

export async function relayLine(line, options = {}) {
  const write = options.write ?? ((value) => process.stdout.write(`${value}\n`));
  const writeError = options.writeError ?? ((value) => process.stderr.write(`${value}\n`));
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    write(JSON.stringify({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" },
    }));
    return;
  }

  try {
    const responses = await relayMessage(message, options);
    for (const response of responses) write(JSON.stringify(response));
  } catch (error) {
    const messageText = error instanceof Error ? error.message : String(error);
    writeError(`[mcplookup-mcp] ${messageText}`);
  }
}

export async function runStdioRelay(options = {}) {
  const input = options.input ?? process.stdin;
  const lines = createInterface({ input, crlfDelay: Infinity, terminal: false });
  for await (const line of lines) {
    if (line.trim()) await relayLine(line, options);
  }
}
