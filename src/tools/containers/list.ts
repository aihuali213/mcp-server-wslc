import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerContainerListTool(server: McpServer): void {
  server.registerTool(
    "list_containers",
    {
      description:
        "List all WSL containers. Use the optional 'format' parameter to control output format (table, json).",
      inputSchema: {
        format: z
          .enum(["table", "json"])
          .optional()
          .default("table")
          .describe("Output format for the container list"),
      },
    },
    async ({ format }) => {
      const args = ["container", "list"];
      if (format && format !== "table") {
        args.push("--format", format);
      }
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return {
        content: [{ type: "text" as const, text }],
      };
    }
  );
}
