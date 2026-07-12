import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerVolumeListTool(server: McpServer): void {
  server.registerTool(
    "volume_list",
    {
      description: "List all WSL volumes.",
      inputSchema: {
        format: z.enum(["table", "json"]).optional().default("table").describe("Output format"),
        quiet: z.boolean().optional().describe("Only display volume names"),
      },
    },
    async ({ format, quiet }) => {
      const args = ["volume", "list"];
      if (format && format !== "table") args.push("--format", format);
      if (quiet) args.push("--quiet");
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
