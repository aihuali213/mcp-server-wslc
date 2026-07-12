import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerContainerLogsTool(server: McpServer): void {
  server.registerTool(
    "container_logs",
    {
      description: "View logs from a WSL container.",
      inputSchema: {
        containerId: z.string().describe("Container ID or name"),
        follow: z.boolean().optional().describe("Follow log output (streaming)"),
        tail: z.number().int().min(0).optional().describe("Number of lines to show from the end"),
        timestamps: z.boolean().optional().describe("Show timestamps in log output"),
        since: z.string().optional().describe("Show logs since timestamp (Unix epoch seconds or RFC3339, e.g. 2024-01-15T10:30:00Z)"),
        until: z.string().optional().describe("Show logs until timestamp (Unix epoch seconds or RFC3339, e.g. 2024-01-15T10:30:00Z)"),
      },
    },
    async ({ containerId, follow, tail, timestamps, since, until }) => {
      const args = ["container", "logs"];
      if (follow) args.push("--follow");
      if (tail !== undefined) args.push("--tail", String(tail));
      if (timestamps) args.push("--timestamps");
      if (since) args.push("--since", since);
      if (until) args.push("--until", until);
      args.push(containerId);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
