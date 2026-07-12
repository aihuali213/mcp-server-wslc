import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerRegistryLoginTool(server: McpServer): void {
  server.registerTool(
    "registry_login",
    {
      description:
        "Log in to a container registry. If no server is specified, the session default is used. Prefer using passwordStdin over password to avoid exposing credentials in process lists.",
      inputSchema: {
        server: z.string().optional().describe("Registry server URL (default: session-defined default)"),
        username: z.string().optional().describe("Username"),
        password: z.string().optional().describe("Password or personal access token (PAT). Prefer passwordStdin for security."),
        passwordStdin: z.boolean().optional().describe("Read password from stdin (more secure than --password flag)"),
      },
    },
    async ({ server, username, password, passwordStdin }) => {
      const args = ["registry", "login"];
      if (username) args.push("--username", username);
      if (passwordStdin) {
        args.push("--password-stdin");
      } else if (password) {
        args.push("--password", password);
      }
      if (server) args.push(server);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
