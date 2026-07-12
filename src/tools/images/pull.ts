import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerImagePullTool(server: McpServer): void {
  server.registerTool(
    "image_pull",
    {
      description: "Pull a container image from a registry.",
      inputSchema: {
        image: z.string().describe("Image name (e.g., ubuntu:24.04, registry.example.com/app:v1)"),
      },
    },
    async ({ image }) => {
      const { stdout, stderr } = await runWslc(["image", "pull", image]);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
