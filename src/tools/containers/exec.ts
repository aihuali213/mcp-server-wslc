import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerContainerExecTool(server: McpServer): void {
  server.registerTool(
    "container_exec",
    {
      description: "Execute a command inside a running WSL container.",
      inputSchema: {
        containerId: z.string().describe("Container ID or name"),
        command: z.string().describe("Command to run inside the container"),
        commandArgs: z.array(z.string()).optional().describe("Arguments for the command"),
        detach: z.boolean().optional().describe("Run in detached mode"),
        env: z.record(z.string(), z.string()).optional().describe("Environment variables (key=value pairs)"),
        interactive: z.boolean().optional().describe("Keep stdin open"),
        tty: z.boolean().optional().describe("Allocate a pseudo-TTY"),
        user: z.string().optional().describe("User to run the command as (name|uid|uid:gid)"),
        workdir: z.string().optional().describe("Working directory inside the container"),
      },
    },
    async ({ containerId, command, commandArgs, detach, env, interactive, tty, user, workdir }) => {
      const args = ["container", "exec"];
      if (detach) args.push("--detach");
      if (interactive) args.push("--interactive");
      if (tty) args.push("--tty");
      if (user) args.push("--user", user);
      if (workdir) args.push("--workdir", workdir);
      if (env) {
        for (const [k, v] of Object.entries(env)) {
          args.push("--env", `${k}=${v}`);
        }
      }
      args.push(containerId, command);
      if (commandArgs) args.push(...commandArgs);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
