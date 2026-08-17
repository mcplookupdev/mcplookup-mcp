# Changelog

## 0.1.6

- Fixes the version the wrapper reports about itself. `PACKAGE_VERSION` was hardcoded and had
  fallen two releases behind, so `0.1.5` sent `User-Agent: mcplookup-mcp/0.1.3`. It is now
  derived from `package.json` and covered by a test, so it cannot drift again.
- Aligns the Claude and Codex plugin manifests with the package, lockfile, and MCP Registry
  metadata. All five were not on the same version in `0.1.5`.
- No MCP interface changes. Tool names, arguments, and responses are unchanged.

## 0.1.5

- No runtime or MCP interface changes.
- Adds the tracked MCPLookup Trust Index badge to the packaged README.
- Aligns the package lockfile, npm package version, and MCP Registry metadata at `0.1.5`.

## 0.1.4

- No runtime or MCP interface changes.
- First release published through npm Trusted Publishing with verifiable build provenance.
- Aligns the package lockfile, npm package version, and MCP Registry metadata at `0.1.4`.

## 0.1.3

- Republished under the MCPLookup organization account. No runtime or interface changes.
- Supersedes 0.1.0 and 0.1.2, both unpublished. Pin `0.1.3` or later.
- Matches the MCP Registry entry version so the two are easy to correlate. They may diverge
  again in future: Registry metadata is immutable, so a metadata-only change needs a new
  entry version without a new npm artifact.

## 0.1.0

- Initial public stdio compatibility wrapper.
- Relays anonymously to the canonical MCPLookup Streamable HTTP endpoint.
- Preserves the hosted server's three-tool, read-only interface.
