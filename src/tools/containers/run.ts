import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

const memoryPattern = /^\d+(\.\d+)?[MG]$/;

/** Parameter shape for container_run — used by both the tool and tests. */
export interface ContainerRunParams {
  image: string;
  name?: string;
  command?: string;
  commandArgs?: string[];
  detach?: boolean;
  cpus?: number;
  memory?: string;
  env?: Record<string, string>;
  publish?: string[];
  volume?: string[];
  workdir?: string;
  interactive?: boolean;
  tty?: boolean;
  rm?: boolean;
}

/** Build wslc CLI arguments from container_run params. Exported for testing. */
export function buildContainerRunArgs(params: ContainerRunParams): string[] {
  const args = ["container", "run"];
  if (params.name) args.push("--name", params.name);
  if (params.detach) args.push("--detach");
  if (params.cpus !== undefined) args.push("--cpus", String(params.cpus));
  if (params.memory) args.push("--memory", params.memory);
  if (params.interactive) args.push("--interactive");
  if (params.tty) args.push("--tty");
  if (params.rm) args.push("--rm");
  if (params.workdir) args.push("--workdir", params.workdir);
  if (params.publish) {
    for (const p of params.publish) args.push("--publish", p);
  }
  if (params.volume) {
    for (const v of params.volume) args.push("--volume", v);
  }
  if (params.env) {
    for (const [k, v] of Object.entries(params.env)) {
      args.push("--env", `${k}=${v}`);
    }
  }
  args.push(params.image);
  if (params.command) {
    args.push(params.command);
    if (params.commandArgs) args.push(...params.commandArgs);
  }
  return args;
}

export function registerContainerRunTool(server: McpServer): void {
  server.registerTool(
    "container_run",
    {
      description: "Run a new WSL container. Defaults to foreground; use detach for background.",
      inputSchema: {
        image: z.string().describe("Container image name (e.g., ubuntu:24.04)"),
        name: z.string().optional().describe("Container name"),
        command: z.string().optional().describe("Command to run in the container"),
        commandArgs: z.array(z.string()).optional().describe("Arguments for the command"),
        detach: z.boolean().optional().describe("Run container in background"),
        cpus: z.number().min(0.5).optional().describe("CPU count (e.g. 0.5, 1, 2.5)"),
        memory: z.string().regex(memoryPattern, "Format: <number>M or <number>G").optional().describe("Memory limit (e.g. 512M, 1G)"),
        env: z.record(z.string(), z.string()).optional().describe("Environment variables (key=value pairs)"),
        publish: z.array(z.string()).optional().describe("Port mappings (e.g. ['8080:80', '443:443'])"),
        volume: z.array(z.string()).optional().describe("Volume bind mounts (e.g. ['/host:/container'])"),
        workdir: z.string().optional().describe("Working directory inside the container"),
        interactive: z.boolean().optional().describe("Keep stdin open"),
        tty: z.boolean().optional().describe("Allocate a pseudo-TTY"),
        rm: z.boolean().optional().describe("Remove container after it stops"),
      },
    },
    async (params) => {
      const args = buildContainerRunArgs(params);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
