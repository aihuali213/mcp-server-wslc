import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { runWslc } from "../../utils/wslc.js";

export function registerSystemVersionTool(server: McpServer): void {
  server.registerTool(
    "system_version",
    {
      description: "Get wslc CLI version information.",
    },
    async () => {
      const { stdout, stderr } = await runWslc(["version"]);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
