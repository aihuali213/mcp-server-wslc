import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerImageRemoveTool(server: McpServer): void {
  server.registerTool(
    "image_remove",
    {
      description: "Remove a container image.",
      inputSchema: {
        image: z.string().describe("Image name or ID"),
        force: z.boolean().optional().describe("Force removal even if in use"),
        noPrune: z.boolean().optional().describe("Do not delete untagged parents"),
      },
    },
    async ({ image, force, noPrune }) => {
      const args = ["image", "remove"];
      if (force) args.push("--force");
      if (noPrune) args.push("--no-prune");
      args.push(image);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
