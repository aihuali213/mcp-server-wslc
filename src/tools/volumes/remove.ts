import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerVolumeRemoveTool(server: McpServer): void {
  server.registerTool(
    "volume_remove",
    {
      description: "Remove one or more volumes. Volumes in use by a container cannot be removed.",
      inputSchema: {
        name: z.string().describe("Volume name"),
        force: z.boolean().optional().describe("Do not error if the volume does not exist"),
      },
    },
    async ({ name, force }) => {
      const args = ["volume", "remove"];
      if (force) args.push("--force");
      args.push(name);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
