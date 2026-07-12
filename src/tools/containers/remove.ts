import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerContainerRemoveTool(server: McpServer): void {
  server.registerTool(
    "container_remove",
    {
      description: "Remove a WSL container.",
      inputSchema: {
        containerId: z.string().describe("Container ID or name"),
        force: z.boolean().optional().describe("Force removal even if running"),
      },
    },
    async ({ containerId, force }) => {
      const args = ["container", "remove"];
      if (force) args.push("--force");
      args.push(containerId);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
