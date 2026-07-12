import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { runWslc } from "../../utils/wslc.js";

export function registerImageBuildTool(server: McpServer): void {
  server.registerTool(
    "image_build",
    {
      description: "Build a container image from a Dockerfile.",
      inputSchema: {
        path: z.string().describe("Path to the build context directory"),
        file: z.string().optional().describe("Path to the Dockerfile (default: 'Dockerfile' in context)"),
        tag: z.array(z.string()).optional().describe("Tags for the built image (e.g. ['myapp:latest', 'myapp:v1'])"),
        buildArg: z.record(z.string(), z.string()).optional().describe("Build-time variables (KEY=VALUE)"),
        target: z.string().optional().describe("Target build stage"),
        pull: z.boolean().optional().describe("Always attempt to pull a newer version of the image"),
        noCache: z.boolean().optional().describe("Do not use cache when building the image"),
        label: z.record(z.string(), z.string()).optional().describe("Metadata labels"),
        verbose: z.boolean().optional().describe("Enable verbose output"),
      },
    },
    async ({ path, file, tag, buildArg, target, pull, noCache, label, verbose }) => {
      const args = ["image", "build"];
      if (file) args.push("--file", file);
      if (tag) {
        for (const t of tag) args.push("--tag", t);
      }
      if (buildArg) {
        for (const [k, v] of Object.entries(buildArg)) {
          args.push("--build-arg", `${k}=${v}`);
        }
      }
      if (target) args.push("--target", target);
      if (pull) args.push("--pull");
      if (noCache) args.push("--no-cache");
      if (verbose) args.push("--verbose");
      if (label) {
        for (const [k, v] of Object.entries(label)) {
          args.push("--label", `${k}=${v}`);
        }
      }
      args.push(path);
      const { stdout, stderr } = await runWslc(args);
      const text = stderr ? `stdout:\n${stdout}\n\nstderr:\n${stderr}` : stdout;
      return { content: [{ type: "text" as const, text }] };
    }
  );
}
