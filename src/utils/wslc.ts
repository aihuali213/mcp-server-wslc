import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const WSLSC_BIN = "wslc";
const DEFAULT_TIMEOUT = 30_000; // 30s

/**
 * Execute a wslc command and return trimmed stdout/stderr.
 * All tools call through this single wrapper — keeps error handling,
 * timeouts, and future changes consistent across every tool.
 */
export async function runWslc(args: string[]): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await execFileAsync(WSLSC_BIN, args, {
      encoding: "utf-8",
      timeout: DEFAULT_TIMEOUT,
      windowsHide: true,
    });
    return {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    };
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException & {
      stdout?: string;
      stderr?: string;
      killed?: boolean;
    };
    if (err.killed) {
      throw new Error(
        `wslc ${args.join(" ")} timed out after ${DEFAULT_TIMEOUT / 1000}s`
      );
    }
    if (err.code === "ENOENT") {
      throw new Error(
        `wslc binary not found. Is wslc installed and on PATH?`
      );
    }
    const detail = err.stderr?.trim() || err.stdout?.trim() || err.message;
    throw new Error(`wslc ${args.join(" ")} failed: ${detail}`);
  }
}
