# mcp-server-wslc

[![npm version](https://img.shields.io/npm/v/mcp-server-wslc)](https://www.npmjs.com/package/mcp-server-wslc)
[![License](https://img.shields.io/npm/l/mcp-server-wslc)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org)

MCP (Model Context Protocol) server for Microsoft's `wslc` CLI — a typed API wrapper that lets AI agents manage WSL containers safely.

## Supported Clients

Claude Code · Codex CLI · Hermes · OpenClaw · Cursor · VS Code Agent

---

## Quick Start

```bash
npm install -g mcp-server-wslc
```

Or run directly with npx:

```bash
npx mcp-server-wslc
```

**Requirements:** Node.js >= 22, `wslc` on PATH.

---

## Client Configuration

### Claude Code

```json
{
  "mcpServers": {
    "wslc": {
      "command": "npx",
      "args": ["mcp-server-wslc"]
    }
  }
}
```

Restart Claude Code, then try:

> List all WSL containers.
> Pull alpine:latest.
> Create a container named "web-test" from ubuntu:24.04 with 512M memory.

### Codex CLI

```json
{
  "mcpServers": {
    "wslc": {
      "command": "npx",
      "args": ["mcp-server-wslc"]
    }
  }
}
```

### Cursor / VS Code Agent

```json
{
  "mcpServers": {
    "wslc": {
      "command": "npx",
      "args": ["mcp-server-wslc"]
    }
  }
}
```

### Hermes / OpenClaw

```json
{
  "mcpServers": {
    "wslc": {
      "command": "npx",
      "args": ["mcp-server-wslc"]
    }
  }
}
```

---

## Commands

```bash
npm run dev          # tsx — run TypeScript directly
npm run build        # tsc → dist/
npm run check        # tsc --noEmit (type-check only)
npm run test         # vitest — run unit tests
npm run test:watch   # vitest — watch mode
npm run test:coverage # vitest — test coverage report
npm start            # node dist/index.js (production)
```

---

## Available Tools

### Core

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_containers` | List all WSL containers | `format` (table \| json) |
| `list_images` | List all WSL container images | `format` (table \| json) |

### Container Management

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `container_create` | Create a new container | `image`, `name`, `cpus`, `memory`, `env`, `publish`, `volume`, `workdir`, `interactive`, `tty`, `rm` |
| `container_run` | Run a container | `image`, `name`, `detach`, `cpus`, `memory`, `env`, `publish`, `volume`, `interactive`, `tty`, `rm` |
| `container_inspect` | Show container details | `containerId` |
| `container_start` | Start a stopped container | `containerId`, `attach`, `interactive` |
| `container_stop` | Stop a running container | `containerId`, `signal`, `time` |
| `container_restart` | Restart a container (stop + start) | `containerId`, `signal`, `time` |
| `container_remove` | Remove a container | `containerId`, `force` |
| `container_logs` | View container logs | `containerId`, `follow`, `tail`, `timestamps`, `since`, `until` |
| `container_exec` | Execute a command in a container | `containerId`, `command`, `commandArgs`, `detach`, `env`, `interactive`, `tty`, `user`, `workdir` |
| `container_stats` | Resource usage snapshot | `containerId`, `all`, `format`, `noTrunc` |

> `container_restart` composes `stop` + `start` — wslc has no native restart command.

### Image Management

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `image_pull` | Pull an image from a registry | `image` |
| `image_push` | Push an image to a registry | `image` |
| `image_build` | Build an image from a Dockerfile | `path`, `file`, `tag`, `buildArg`, `target`, `pull`, `noCache`, `label`, `verbose` |
| `image_tag` | Tag an image | `source`, `target` |
| `image_inspect` | Show image details | `image` |
| `image_remove` | Remove an image | `image`, `force`, `noPrune` |

### Network Management

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `network_list` | List all networks | `format`, `quiet` |
| `network_create` | Create a network | `name`, `driver`, `opt`, `label` |
| `network_remove` | Remove a network | `name`, `force` |

### Volume Management

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `volume_list` | List all volumes | `format`, `quiet` |
| `volume_create` | Create a named volume | `name`, `driver`, `opt`, `label` |
| `volume_remove` | Remove a volume | `name`, `force` |

### Registry Authentication

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `registry_login` | Log in to a registry | `server`, `username`, `password`, `passwordStdin` |
| `registry_logout` | Log out from a registry | `server` |

> **Security:** Prefer `passwordStdin` over `password` to avoid exposing credentials in process lists.

### System

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `system_version` | Get wslc CLI version | — |
| `system_prune` | Remove all stopped containers | — |

---

## Example Prompts

```
List all running WSL containers.
Show me the wslc version.
What container images are available? Show in JSON format.
Create a container named "web-test" from ubuntu:24.04 with 1 CPU and 512M memory.
Run nginx in the background with port 8080 published.
View the last 50 lines of logs from container "web-test".
Get stats for all running containers in JSON format.
Pull alpine:latest and create a container from it.
Tag ubuntu:24.04 as my-ubuntu:latest.
Create a network named "backend" and run a container attached to it.
```

---

## Project Structure

```
mcp-server-wslc/
├── src/
│   ├── index.ts                     # Entry point
│   ├── server.ts                    # McpServer + stdio transport
│   ├── registry/
│   │   └── registerTools.ts         # Central tool registration
│   ├── tools/
│   │   ├── containers/              # 11 files + 1 test
│   │   │   ├── list.ts, create.ts, run.ts, run.test.ts, inspect.ts
│   │   │   ├── start.ts, stop.ts, restart.ts, remove.ts
│   │   │   └── logs.ts, exec.ts, stats.ts
│   │   ├── images/                  # 7 files
│   │   │   ├── list.ts, pull.ts, push.ts, build.ts
│   │   │   └── tag.ts, inspect.ts, remove.ts
│   │   ├── networks/                # 3 files
│   │   │   └── list.ts, create.ts, remove.ts
│   │   ├── volumes/                 # 3 files
│   │   │   └── list.ts, create.ts, remove.ts
│   │   ├── registry/                # 2 files
│   │   │   └── login.ts, logout.ts
│   │   └── system/                  # 2 files
│   │       └── version.ts, prune.ts
│   └── utils/
│       ├── wslc.ts                  # runWslc() — single execution point
│       └── wslc.test.ts             # Unit tests for runWslc()
├── dist/                            # Compiled output (33 JS files)
├── vitest.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── README.zh-CN.md
```
---

## Testing

Unit tests use [vitest](https://vitest.dev). Tests cover:

- **`runWslc()`** — execution wrapper: stdout/stderr trimming, timeout, ENOENT, error propagation
- **`buildContainerRunArgs()`** — CLI argument construction for `container_run`: all parameter types and combinations

```bash
npm run test           # Single run
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report (v8)
```
---

## License

ISC
