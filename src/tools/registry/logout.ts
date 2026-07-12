import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerRegistryLogoutTool(server: McpServer): void {
  server.registerTool(
    "registry_logout",
    {
      description: "Log out from a container registry. If no server is specified, the session default is used.",
      inputSchema: {
        server: z.string().optional().describe("Registry server URL (default: session-defined default)"),
      },
    },
    async ({ server }) => {
      const args = ["registry", "logout"];
      if (server) args.push(server);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
