import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted — use vi.hoisted() so mockExecFile is initialized in time
const { mockExecFile } = vi.hoisted(() => ({
  mockExecFile: vi.fn(),
}));

vi.mock("node:child_process", () => ({
  execFile: mockExecFile,
}));

import { runWslc } from "./wslc.js";

describe("runWslc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should execute wslc with the given args and return trimmed stdout", async () => {
    mockExecFile.mockImplementation((_bin, _args, _opts, callback) => {
      callback(null, { stdout: "  output  ", stderr: "" });
    });

    const result = await runWslc(["container", "list"]);

    expect(mockExecFile).toHaveBeenCalledOnce();
    expect(mockExecFile).toHaveBeenCalledWith("wslc", ["container", "list"], {
      encoding: "utf-8",
      timeout: 30_000,
      windowsHide: true,
    }, expect.any(Function));

    expect(result).toEqual({
      stdout: "output",
      stderr: "",
    });
  });

  it("should trim stderr as well", async () => {
    mockExecFile.mockImplementation((_bin, _args, _opts, callback) => {
      callback(null, { stdout: "ok", stderr: "  warning  " });
    });

    const result = await runWslc(["info"]);

    expect(result).toEqual({
      stdout: "ok",
      stderr: "warning",
    });
  });

  it("should throw a timeout error when execFile is killed", async () => {
    const err: NodeJS.ErrnoException & { killed?: boolean; stdout?: string; stderr?: string } =
      Object.assign(new Error("killed"), {
        code: "ETIMEDOUT",
        killed: true,
        stdout: "",
        stderr: "",
      });

    mockExecFile.mockImplementation((_bin, _args, _opts, callback) => {
      callback(err);
    });

    await expect(runWslc(["container", "run", "ubuntu"])).rejects.toThrow(
      "wslc container run ubuntu timed out after 30s"
    );
  });

  it("should throw ENOENT error when wslc binary is not found", async () => {
    const err: NodeJS.ErrnoException & { stdout?: string; stderr?: string } =
      Object.assign(new Error("ENOENT"), {
        code: "ENOENT",
        stdout: "",
        stderr: "",
      });

    mockExecFile.mockImplementation((_bin, _args, _opts, callback) => {
      callback(err);
    });

    await expect(runWslc(["version"])).rejects.toThrow(
      "wslc binary not found. Is wslc installed and on PATH?"
    );
  });

  it("should include stderr in the error for general failures", async () => {
    const err: NodeJS.ErrnoException & { stdout?: string; stderr?: string } =
      Object.assign(new Error("command failed"), {
        code: "UNKNOWN",
        stdout: "",
        stderr: "container not found\n",
      });

    mockExecFile.mockImplementation((_bin, _args, _opts, callback) => {
      callback(err);
    });

    await expect(runWslc(["container", "inspect", "missing"])).rejects.toThrow(
      "wslc container inspect missing failed: container not found"
    );
  });

  it("should fall back to stdout if stderr is empty on failure", async () => {
    const err: NodeJS.ErrnoException & { stdout?: string; stderr?: string } =
      Object.assign(new Error("command failed"), {
        code: "UNKNOWN",
        stdout: "error on stdout\n",
        stderr: "",
      });

    mockExecFile.mockImplementation((_bin, _args, _opts, callback) => {
      callback(err);
    });

    await expect(runWslc(["badcommand"])).rejects.toThrow(
      "wslc badcommand failed: error on stdout"
    );
  });

  it("should fall back to err.message when both stdout and stderr are empty", async () => {
    const err: NodeJS.ErrnoException & { stdout?: string; stderr?: string } =
      Object.assign(new Error("Unknown system error"), {
        code: "UNKNOWN",
        stdout: "",
        stderr: "",
      });

    mockExecFile.mockImplementation((_bin, _args, _opts, callback) => {
      callback(err);
    });

    await expect(runWslc(["info"])).rejects.toThrow(
      "wslc info failed: Unknown system error"
    );
  });
});
