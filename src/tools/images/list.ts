import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerImageListTool(server: McpServer): void {
  server.registerTool(
    "list_images",
    {
      description:
        "List all WSL container images. Use the optional 'format' parameter to control output format (table, json).",
      inputSchema: {
        format: z
          .enum(["table", "json"])
          .optional()
          .default("table")
          .describe("Output format for the image list"),
      },
    },
    async ({ format }) => {
      const args = ["image", "list"];
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
