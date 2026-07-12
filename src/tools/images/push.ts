import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerImagePushTool(server: McpServer): void {
  server.registerTool(
    "image_push",
    {
      description: "Push a container image to a registry.",
      inputSchema: {
        image: z.string().describe("Image name (e.g., registry.example.com/app:v1)"),
      },
    },
    async ({ image }) => {
      const { stdout, stderr } = await runWslc(["image", "push", image]);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
