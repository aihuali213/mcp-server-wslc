import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./registry/registerTools.js";

const SERVER_NAME = "mcp-server-wslc";
const SERVER_VERSION = "1.0.0";

/**
 * Create and configure the MCP server instance.
 * Tools are registered via registerAllTools.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  registerAllTools(server);

  return server;
}

/**
 * Start the server with stdio transport.
 * This is the entry point for production and dev use.
 */
export async function startServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  // Graceful shutdown on SIGTERM / SIGINT
  const shutdown = async () => {
    await server.close();
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  await server.connect(transport);

  // Log to stderr to avoid interfering with stdio protocol
  console.error(`${SERVER_NAME} v${SERVER_VERSION} started (stdio)`);
}
