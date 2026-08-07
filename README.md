# MCPLookup MCP

[![npm](https://img.shields.io/npm/v/@mcplookup/mcp.svg)](https://www.npmjs.com/package/@mcplookup/mcp)
[![tests](https://github.com/mcplookupdev/mcplookup-mcp/actions/workflows/test.yml/badge.svg)](https://github.com/mcplookupdev/mcplookup-mcp/actions/workflows/test.yml)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

The official stdio compatibility wrapper for the MCPLookup remote MCP server—the
independent trust layer for MCP.

The canonical server is `https://mcplookup.com/mcp`. It provides three anonymous,
read-only tools:

- `resolve_server` resolves a title, package, endpoint, or name to a canonical server.
- `find_servers` finds up to five servers using MCPLookup's normalized taxonomy.
- `trust_lookup` returns the current Trust Index, verdict, evidence, and citation.

This package exists for MCP clients that require a local stdio command. It forwards MCP
messages to the canonical hosted server without implementing scoring, storing evidence,
adding authentication, or changing tool results.

## Connect

Connect directly when your client supports remote Streamable HTTP:

```text
https://mcplookup.com/mcp
```

Use this package when your client requires a local stdio command:

Node.js 20 or newer is required. No API key or environment variable is needed.

```bash
npx -y @mcplookup/mcp
```

Generic MCP client configuration:

```json
{
  "mcpServers": {
    "mcplookup": {
      "command": "npx",
      "args": ["-y", "@mcplookup/mcp"]
    }
  }
}
```

Prefer a direct Streamable HTTP connection to `https://mcplookup.com/mcp` when your client
supports remote MCP servers. The package is a transport adapter, not a separate service.

## MCP Registry

MCPLookup is listed in the official MCP Registry as
[`com.mcplookup/mcp`](https://registry.modelcontextprotocol.io/v0.1/servers?search=com.mcplookup/mcp).
The name is verified through DNS control of `mcplookup.com`.

One entry covers both connection paths, so a client installing from the Registry can use
whichever it supports:

| Path | Declaration |
| --- | --- |
| Canonical remote | `streamable-http` → `https://mcplookup.com/mcp` |
| Compatibility package | npm `@mcplookup/mcp`, `stdio` transport |

The entry declares no environment variables, headers, or credentials, matching the
anonymous public interface. [`server.json`](./server.json) in this repository is the source
of that metadata.

## What stays remote

The wrapper contains no trust scores, evidence database, taxonomy, authentication system,
or scoring logic. MCPLookup evaluates public evidence at the canonical service and returns
the same bounded, current-state response whether a client connects directly or through this
stdio adapter.

## Data and security

The wrapper has no credentials and writes no local data. Requests are sent to MCPLookup's
hosted endpoint, where bounded security and product telemetry are processed under the
[MCPLookup privacy and retention terms](https://mcplookup.com/legal). See the
[MCP documentation](https://mcplookup.com/docs/mcp) for the public interface contract.

Report security issues according to [SECURITY.md](./SECURITY.md). For product support,
email [hello@mcplookup.com](mailto:hello@mcplookup.com).

Bug reports and narrowly scoped compatibility improvements are welcome. See
[CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## Development

```bash
npm test
npm pack --dry-run
```

The package intentionally has zero runtime dependencies.
