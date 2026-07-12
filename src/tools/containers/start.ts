import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerContainerStartTool(server: McpServer): void {
  server.registerTool(
    "container_start",
    {
      description: "Start a stopped WSL container.",
      inputSchema: {
        containerId: z.string().describe("Container ID or name"),
        attach: z.boolean().optional().describe("Attach to container stdout/stderr"),
        interactive: z.boolean().optional().describe("Attach to stdin and keep it open"),
      },
    },
    async ({ containerId, attach, interactive }) => {
      const args = ["container", "start"];
      if (attach) args.push("--attach");
      if (interactive) args.push("--interactive");
      args.push(containerId);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
