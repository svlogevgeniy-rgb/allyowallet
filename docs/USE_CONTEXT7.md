# Using Upstash Context7 MCP Server

To keep code examples and API usage aligned with the latest upstream releases, the Allyo Wallet project integrates the **Upstash Context7 MCP server**. Context7 enriches LLM prompts with real-time documentation and working snippets for the libraries we depend on (NestJS, Prisma, ethers.js, WalletCore, etc.), helping prevent hallucinated or outdated code.

## Prerequisites
- Upstash account (free tier is enough for documentation access).
- Upstash API key (create via [Console → Account → API Keys](https://console.upstash.com/account/api)).
- Node.js ≥ 18 (already required for the repo).

## Quick Start
Export your credentials and launch the MCP server locally:

```bash
export UPSTASH_EMAIL="you@example.com"
export UPSTASH_API_KEY="upstash_api_key"
./scripts/context7.sh
```

The script wraps the official CLI:

- uses `npx @upstash/mcp-server@latest`
- exposes the MCP endpoint on `http://localhost:3000/mcp` by default (HTTP transport enabled)

Stop with `Ctrl+C`.

## Integration With MCP Clients

### Claude Desktop / CLI MCP clients
Add or update `claude_desktop_config.json` (or analogous MCP config):

```json
{
  "mcpServers": {
    "use-context7": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### Cursor / VS Code MCP
Use the built-in MCP configuration UI or add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "use-context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/mcp-server@latest",
        "--email",
        "YOUR_EMAIL",
        "--api-key",
        "YOUR_API_KEY"
      ]
    }
  }
}
```

> Prefer the HTTP transport (`context7.sh`) when working locally to avoid repeated logins and to support multiple clients.

## Usage Tips
- When asking the AI assistant to use a library, mention “use Context7” so the MCP tooling injects the freshest docs.
- Context7 supports scoping requests to packages (e.g., “Context7: ethers.js v6 account abstraction examples”) to get relevant snippets.
- Logs are stored under `~/Library/Logs/Claude/mcp*.log` (macOS) or the equivalent directory on your platform.

## Troubleshooting
- **Auth errors**: re-check `UPSTASH_EMAIL` / `UPSTASH_API_KEY`; tokens revoked in the console invalidate the MCP session.
- **Command not found**: ensure `npx` resolves; if using `nvm`, replace `npx` in configs with the absolute path (e.g., `/usr/local/bin/npx`).
- **Network blocked**: Context7 needs outbound HTTPS to Upstash API; verify firewall/proxy rules.

For more details, see the upstream repository: [github.com/upstash/mcp-server](https://github.com/upstash/mcp-server).
