import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

/**
 * Restart a container by stopping it then starting it.
 * wslc does not have a native "restart" subcommand, so this tool
 * composes stop + start with a small delay between them.
 */
export function registerContainerRestartTool(server: McpServer): void {
  server.registerTool(
    "container_restart",
    {
      description:
        "Restart a WSL container. Since wslc has no native restart command, this stops then starts the container.",
      inputSchema: {
        containerId: z.string().describe("Container ID or name"),
        signal: z.string().optional().describe("Signal to send on stop (e.g. SIGTERM)"),
        time: z.number().int().min(0).optional().describe("Seconds to wait before killing on stop (default: 5)"),
      },
    },
    async ({ containerId, signal, time }) => {
      // Stop
      const stopArgs = ["container", "stop"];
      if (signal) stopArgs.push("--signal", signal);
      if (time !== undefined) stopArgs.push("--time", String(time));
      stopArgs.push(containerId);
      const stopResult = await runWslc(stopArgs);

      // Brief pause to let the container fully stop
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Start
      const startArgs = ["container", "start", containerId];
      const startResult = await runWslc(startArgs);

      const text = [
        `--- stop ---\n${stopResult.stdout}`,
        stopResult.stderr ? `stderr: ${stopResult.stderr}` : "",
        `--- start ---\n${startResult.stdout}`,
        startResult.stderr ? `stderr: ${startResult.stderr}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      return { content: [{ type: "text" as const, text }] };
    }
  );
}
