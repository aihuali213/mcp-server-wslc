import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerNetworkRemoveTool(server: McpServer): void {
  server.registerTool(
    "network_remove",
    {
      description: "Remove one or more WSL networks.",
      inputSchema: {
        name: z.string().describe("Network name"),
        force: z.boolean().optional().describe("Do not error if the network does not exist"),
      },
    },
    async ({ name, force }) => {
      const args = ["network", "remove"];
      if (force) args.push("--force");
      args.push(name);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
