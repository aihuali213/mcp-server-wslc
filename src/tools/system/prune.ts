import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { runWslc } from "../../utils/wslc.js";

export function registerSystemPruneTool(server: McpServer): void {
  server.registerTool(
    "system_prune",
    {
      description:
        "Remove all stopped containers and unused images, networks, and volumes to free up resources.",
    },
    async () => {
      const pruneTargets = [
        { label: "container prune", args: ["container", "prune"] },
        { label: "image prune", args: ["image", "prune"] },
        { label: "network prune", args: ["network", "prune"] },
        { label: "volume prune", args: ["volume", "prune"] },
      ];

      const results: string[] = [];
      for (const { label, args } of pruneTargets) {
        try {
          const { stdout, stderr } = await runWslc(args);
          const text = stderr
            ? `--- ${label} ---\nstdout:\n${stdout}\nstderr:\n${stderr}`
            : `--- ${label} ---\n${stdout}`;
          results.push(text);
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          results.push(`--- ${label} ---\nERROR: ${msg}`);
        }
      }

      return { content: [{ type: "text" as const, text: results.join("\n\n") }] };
    }
  );
}
