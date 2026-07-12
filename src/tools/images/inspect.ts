import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerImageInspectTool(server: McpServer): void {
  server.registerTool(
    "image_inspect",
    {
      description: "Display detailed information about a container image.",
      inputSchema: {
        image: z.string().describe("Image name or ID"),
      },
    },
    async ({ image }) => {
      const { stdout, stderr } = await runWslc(["image", "inspect", image]);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
