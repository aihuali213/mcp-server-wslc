import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerNetworkCreateTool(server: McpServer): void {
  server.registerTool(
    "network_create",
    {
      description: "Create a new WSL network.",
      inputSchema: {
        name: z.string().describe("Network name"),
        driver: z.string().optional().describe("Network driver name (default: bridge)"),
        opt: z.record(z.string(), z.string()).optional().describe("Driver-specific options (KEY=VALUE)"),
        label: z.record(z.string(), z.string()).optional().describe("Network metadata labels"),
      },
    },
    async ({ name, driver, opt, label }) => {
      const args = ["network", "create"];
      if (driver) args.push("--driver", driver);
      if (opt) {
        for (const [k, v] of Object.entries(opt)) args.push("--opt", `${k}=${v}`);
      }
      if (label) {
        for (const [k, v] of Object.entries(label)) args.push("--label", `${k}=${v}`);
      }
      args.push(name);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
