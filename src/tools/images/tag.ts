import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerImageTagTool(server: McpServer): void {
  server.registerTool(
    "image_tag",
    {
      description: "Tag a container image with a new name/tag.",
      inputSchema: {
        source: z.string().describe("Current image reference in image-name[:tag] format"),
        target: z.string().describe("New image reference in image-name[:tag] format"),
      },
    },
    async ({ source, target }) => {
      const { stdout, stderr } = await runWslc(["image", "tag", source, target]);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
