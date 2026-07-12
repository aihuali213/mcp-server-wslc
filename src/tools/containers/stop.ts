import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerContainerStopTool(server: McpServer): void {
  server.registerTool(
    "container_stop",
    {
      description: "Stop a running WSL container.",
      inputSchema: {
        containerId: z.string().describe("Container ID or name"),
        signal: z.string().optional().describe("Signal to send to the container (e.g. SIGTERM, SIGKILL)"),
        time: z.number().int().min(0).optional().describe("Seconds to wait before killing (default: 5)"),
      },
    },
    async ({ containerId, signal, time }) => {
      const args = ["container", "stop"];
      if (signal) args.push("--signal", signal);
      if (time !== undefined) args.push("--time", String(time));
      args.push(containerId);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
