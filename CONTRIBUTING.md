# Contributing

Thanks for helping improve the official MCPLookup stdio compatibility wrapper.

## Scope

This repository only adapts local stdio MCP messages to the canonical remote endpoint at
`https://mcplookup.com/mcp`. Changes should preserve that boundary. Trust scoring, evidence,
taxonomy, authentication, and product behavior belong to the hosted service and are outside
this repository.

Good contributions include compatibility fixes, clearer connection documentation, bounded
transport error handling, and tests for protocol-preserving relay behavior.

## Before submitting

1. Open an issue for behavioral changes so the intended contract is clear.
2. Keep runtime dependencies at zero unless there is a compelling security or compatibility
   reason to add one.
3. Run:

   ```bash
   npm test
   npm pack --dry-run
   ```

4. Never include credentials, private traffic data, or vulnerability details in a public
   issue. Follow [SECURITY.md](./SECURITY.md) for private security reports.

## Maintainer releases

Package releases are published by `.github/workflows/publish.yml` from a GitHub Release whose
tag exactly matches `v<package.json version>`. The workflow uses npm Trusted Publishing (OIDC),
not an npm token, and npm records build provenance for the resulting package version.

Do not publish from a local checkout. Public repository commits and package metadata use the
MCPLookup identity, `hello@mcplookup.com`.
