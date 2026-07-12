import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerContainerInspectTool(server: McpServer): void {
  server.registerTool(
    "container_inspect",
    {
      description: "Display detailed information about a WSL container.",
      inputSchema: {
        containerId: z.string().describe("Container ID or name"),
      },
    },
    async ({ containerId }) => {
      const { stdout, stderr } = await runWslc([
        "container", "inspect", containerId,
      ]);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
