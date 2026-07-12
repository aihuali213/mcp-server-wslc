import { describe, it, expect } from "vitest";
import { buildContainerRunArgs } from "./run.js";
import type { ContainerRunParams } from "./run.js";

describe("buildContainerRunArgs", () => {
  it("should start with container/run subcommand and end with image", () => {
    const args = buildContainerRunArgs({ image: "ubuntu:24.04" });
    expect(args).toEqual(["container", "run", "ubuntu:24.04"]);
  });

  it("should add --name when provided", () => {
    const args = buildContainerRunArgs({ image: "alpine", name: "my-container" });
    expect(args).toEqual(["container", "run", "--name", "my-container", "alpine"]);
  });

  it("should add --detach when true", () => {
    const args = buildContainerRunArgs({ image: "alpine", detach: true });
    expect(args).toContain("--detach");
  });

  it("should NOT add --detach when false", () => {
    const args = buildContainerRunArgs({ image: "alpine", detach: false });
    expect(args).not.toContain("--detach");
  });

  it("should add --cpus with stringified value", () => {
    const args = buildContainerRunArgs({ image: "alpine", cpus: 2.5 });
    expect(args).toContain("--cpus");
    const idx = args.indexOf("--cpus");
    expect(args[idx + 1]).toBe("2.5");
  });

  it("should NOT add --cpus when value is 0 (falsy number)", () => {
    // cpus=0 is a valid falsy number but we check !== undefined
    const args = buildContainerRunArgs({ image: "alpine", cpus: 0 });
    expect(args).toContain("--cpus");
    expect(args[args.indexOf("--cpus") + 1]).toBe("0");
  });

  it("should add --memory when provided", () => {
    const args = buildContainerRunArgs({ image: "alpine", memory: "512M" });
    expect(args).toContain("--memory");
    const idx = args.indexOf("--memory");
    expect(args[idx + 1]).toBe("512M");
  });

  it("should add --interactive when true", () => {
    const args = buildContainerRunArgs({ image: "alpine", interactive: true });
    expect(args).toContain("--interactive");
  });

  it("should add --tty when true", () => {
    const args = buildContainerRunArgs({ image: "alpine", tty: true });
    expect(args).toContain("--tty");
  });

  it("should add --rm when true", () => {
    const args = buildContainerRunArgs({ image: "alpine", rm: true });
    expect(args).toContain("--rm");
  });

  it("should add --workdir when provided", () => {
    const args = buildContainerRunArgs({ image: "alpine", workdir: "/app" });
    expect(args).toContain("--workdir");
    const idx = args.indexOf("--workdir");
    expect(args[idx + 1]).toBe("/app");
  });

  it("should add multiple --publish flags", () => {
    const args = buildContainerRunArgs({
      image: "nginx",
      publish: ["8080:80", "443:443"],
    });
    expect(args).toEqual([
      "container", "run",
      "--publish", "8080:80",
      "--publish", "443:443",
      "nginx",
    ]);
  });

  it("should add multiple --volume flags", () => {
    const args = buildContainerRunArgs({
      image: "alpine",
      volume: ["/host/data:/data", "/host/config:/config"],
    });
    expect(args).toEqual([
      "container", "run",
      "--volume", "/host/data:/data",
      "--volume", "/host/config:/config",
      "alpine",
    ]);
  });

  it("should add --env flags for each env entry", () => {
    const args = buildContainerRunArgs({
      image: "alpine",
      env: { FOO: "bar", DEBUG: "1" },
    });
    expect(args).toEqual([
      "container", "run",
      "--env", "FOO=bar",
      "--env", "DEBUG=1",
      "alpine",
    ]);
  });

  it("should add command and commandArgs after image", () => {
    const args = buildContainerRunArgs({
      image: "alpine",
      command: "echo",
      commandArgs: ["hello", "world"],
    });
    expect(args).toEqual([
      "container", "run",
      "alpine",
      "echo", "hello", "world",
    ]);
  });

  it("should add command without commandArgs", () => {
    const args = buildContainerRunArgs({
      image: "alpine",
      command: "/bin/sh",
    });
    expect(args).toEqual(["container", "run", "alpine", "/bin/sh"]);
  });

  it("should NOT add commandArgs when command is not provided", () => {
    // If no command, commandArgs should be ignored even if passed
    const args = buildContainerRunArgs({
      image: "alpine",
      commandArgs: ["arg1", "arg2"],
    } as ContainerRunParams);
    // commandArgs are only pushed when command is truthy
    expect(args).toEqual(["container", "run", "alpine"]);
  });

  it("should combine all flags in correct order", () => {
    const args = buildContainerRunArgs({
      image: "ubuntu:24.04",
      name: "test",
      detach: true,
      cpus: 1,
      memory: "1G",
      interactive: true,
      tty: true,
      rm: true,
      workdir: "/workspace",
      publish: ["3000:3000"],
      volume: ["/data:/data"],
      env: { NODE_ENV: "production" },
      command: "npm",
      commandArgs: ["start"],
    });

    expect(args).toEqual([
      "container", "run",
      "--name", "test",
      "--detach",
      "--cpus", "1",
      "--memory", "1G",
      "--interactive",
      "--tty",
      "--rm",
      "--workdir", "/workspace",
      "--publish", "3000:3000",
      "--volume", "/data:/data",
      "--env", "NODE_ENV=production",
      "ubuntu:24.04",
      "npm", "start",
    ]);
  });
});
