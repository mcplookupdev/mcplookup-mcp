---
name: verify-mcp-server
description: Resolve and check MCP servers using MCPLookup's public identity and trust evidence. Use before recommending, installing, or connecting an MCP server; when identifying an official or first-party server; when comparing similarly named servers, packages, repositories, or endpoints; or when a user asks whether an MCP server is trustworthy.
---

# Verify an MCP server

Use MCPLookup to identify the intended server and assess the public evidence available for it. Treat every result as a current evidence-based signal, never a safety certification or guarantee.

## Choose the first tool

- Use `resolve_server` when the user names a vendor, product, server, package, repository, Registry identifier, or endpoint.
- Use `find_servers` when the user starts with a task or capability and has no particular product or server in mind.
- Use `trust_lookup` directly only when the user already supplied an exact canonical MCPLookup server name and wants the complete trust record.

## Follow the workflow

1. Establish the intended identity.
   - Call `resolve_server` for a named artifact.
   - If the request is open-ended, call `find_servers`, present the bounded shortlist, and use the selected exact `server.name` with `resolve_server` before recommending a connection.
2. Inspect the compact trust assessment and connection options returned by `resolve_server`.
3. Call `trust_lookup` when the user asks whether the server is trustworthy, requests supporting evidence, or needs coverage, confidence, freshness, or citation details.
4. Compare candidates on identity relationship, publisher evidence, trust assessment, coverage, confidence, freshness, and relevant connection options. Do not rank solely by name similarity or score.
5. State uncertainty and abstain from a definitive recommendation when identity remains ambiguous, evidence is missing or stale, or the requested artifact is unsupported. Ask a focused question when it can resolve the ambiguity.

## Report the result

Include:

- the exact canonical server name;
- why it matches the user's intended vendor, product, package, repository, or endpoint;
- whether the publisher relationship is first-party, third-party, or unresolved when the evidence supports that distinction;
- the trust assessment with confidence, coverage, freshness, and the most decision-relevant evidence gaps;
- the MCPLookup citation;
- connection options only when requested or useful.

Say that MCPLookup evaluates public evidence. Do not describe a result as certified, guaranteed safe, approved, or free of malicious behavior. Do not install, execute, connect to, or proxy another MCP server; provide connection information for the user or client to act on separately.
