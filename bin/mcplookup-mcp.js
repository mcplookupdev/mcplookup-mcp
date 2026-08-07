#!/usr/bin/env node

import { runStdioRelay } from "../src/relay.js";

runStdioRelay().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[mcplookup-mcp] ${message}\n`);
  process.exitCode = 1;
});
