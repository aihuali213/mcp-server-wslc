import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerVolumeCreateTool(server: McpServer): void {
  server.registerTool(
    "volume_create",
    {
      description: "Create a new named volume that can be attached to containers.",
      inputSchema: {
        name: z.string().optional().describe("Volume name (auto-generated if omitted)"),
        driver: z.string().optional().describe("Volume driver name (e.g. 'guest', 'vhd', default: guest)"),
        opt: z.record(z.string(), z.string()).optional().describe("Driver-specific options (KEY=VALUE)"),
        label: z.record(z.string(), z.string()).optional().describe("Volume metadata labels"),
      },
    },
    async ({ name, driver, opt, label }) => {
      const args = ["volume", "create"];
      if (driver) args.push("--driver", driver);
      if (opt) {
        for (const [k, v] of Object.entries(opt)) args.push("--opt", `${k}=${v}`);
      }
      if (label) {
        for (const [k, v] of Object.entries(label)) args.push("--label", `${k}=${v}`);
      }
      if (name) args.push(name);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
