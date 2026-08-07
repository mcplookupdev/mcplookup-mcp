# MCPLookup MCP

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

## Run

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

## Data and security

The wrapper has no credentials and writes no local data. Requests are sent to MCPLookup's
hosted endpoint, where bounded security and product telemetry are processed under the
[MCPLookup privacy and retention terms](https://mcplookup.com/legal). See the
[MCP documentation](https://mcplookup.com/docs/mcp) for the public interface contract.

Report security issues according to [SECURITY.md](./SECURITY.md). For product support,
email [hello@mcplookup.com](mailto:hello@mcplookup.com).

## Development

```bash
npm test
npm pack --dry-run
```

The package intentionally has zero runtime dependencies.
