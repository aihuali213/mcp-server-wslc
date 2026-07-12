import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerContainerStatsTool(server: McpServer): void {
  server.registerTool(
    "container_stats",
    {
      description: "Display resource usage snapshot for running WSL containers.",
      inputSchema: {
        containerId: z.string().optional().describe("Container ID or name. Omit to show all containers."),
        all: z.boolean().optional().describe("Show all containers regardless of status"),
        format: z.enum(["table", "json"]).optional().default("table").describe("Output format"),
        noTrunc: z.boolean().optional().describe("Do not truncate output"),
      },
    },
    async ({ containerId, all, format, noTrunc }) => {
      const args = ["container", "stats"];
      if (all) args.push("--all");
      if (format && format !== "table") args.push("--format", format);
      if (noTrunc) args.push("--no-trunc");
      if (containerId) args.push(containerId);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
