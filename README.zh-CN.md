# mcp-server-wslc

[![npm version](https://img.shields.io/npm/v/mcp-server-wslc)](https://www.npmjs.com/package/mcp-server-wslc)
[![License](https://img.shields.io/npm/l/mcp-server-wslc)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org)

Microsoft `wslc` CLI 的 MCP（Model Context Protocol）服务端 —— 一个类型安全的 API 封装，让 AI 代理能够安全管理 WSL 容器。

## 支持的客户端

Claude Code · Codex CLI · Hermes · OpenClaw · Cursor · VS Code Agent

---

## 快速开始

将以下配置添加到 MCP 客户端的配置文件中：

```json
{
  "mcpServers": {
    "wslc": {
      "command": "npx",
      "args": ["-y", "mcp-server-wslc"]
    }
  }
}
```

重启客户端，然后尝试：

> 列出所有 WSL 容器。
> 拉取 alpine:latest。
> 从 ubuntu:24.04 创建一个名为 "web-test" 的容器，内存限制 512M。

**要求：** Node.js >= 22，`wslc` 在 PATH 中可用。

---

## 命令

```bash
npm run dev           # tsx — 直接运行 TypeScript
npm run build         # tsc → dist/
npm run check         # tsc --noEmit（仅类型检查）
npm run test          # vitest — 运行单元测试
npm run test:watch    # vitest — 监视模式
npm run test:coverage # vitest — 测试覆盖率报告
npm start             # node dist/index.js（生产模式）
```

---

## 可用工具

### 核心

| 工具 | 描述 | 参数 |
|------|------|------|
| `list_containers` | 列出所有 WSL 容器 | `format`（table \| json） |
| `list_images` | 列出所有 WSL 容器镜像 | `format`（table \| json） |

### 容器管理

| 工具 | 描述 | 关键参数 |
|------|------|----------|
| `container_create` | 创建新容器 | `image`、`name`、`cpus`、`memory`、`env`、`publish`、`volume`、`workdir`、`interactive`、`tty`、`rm` |
| `container_run` | 运行容器 | `image`、`name`、`detach`、`cpus`、`memory`、`env`、`publish`、`volume`、`interactive`、`tty`、`rm` |
| `container_inspect` | 显示容器详细信息 | `containerId` |
| `container_start` | 启动已停止的容器 | `containerId`、`attach`、`interactive` |
| `container_stop` | 停止运行中的容器 | `containerId`、`signal`、`time` |
| `container_restart` | 重启容器（stop + start） | `containerId`、`signal`、`time` |
| `container_remove` | 删除容器 | `containerId`、`force` |
| `container_logs` | 查看容器日志 | `containerId`、`follow`、`tail`、`timestamps`、`since`、`until` |
| `container_exec` | 在容器内执行命令 | `containerId`、`command`、`commandArgs`、`detach`、`env`、`interactive`、`tty`、`user`、`workdir` |
| `container_stats` | 资源使用快照 | `containerId`、`all`、`format`、`noTrunc` |

> `container_restart` 由 `stop` + `start` 组合实现 —— wslc 没有原生的 restart 命令。

### 镜像管理

| 工具 | 描述 | 关键参数 |
|------|------|----------|
| `image_pull` | 从仓库拉取镜像 | `image` |
| `image_push` | 推送镜像到仓库 | `image` |
| `image_build` | 从 Dockerfile 构建镜像 | `path`、`file`、`tag`、`buildArg`、`target`、`pull`、`noCache`、`label`、`verbose` |
| `image_tag` | 为镜像打标签 | `source`、`target` |
| `image_inspect` | 显示镜像详细信息 | `image` |
| `image_remove` | 删除镜像 | `image`、`force`、`noPrune` |

### 网络管理

| 工具 | 描述 | 关键参数 |
|------|------|----------|
| `network_list` | 列出所有网络 | `format`、`quiet` |
| `network_create` | 创建网络 | `name`、`driver`、`opt`、`label` |
| `network_remove` | 删除网络 | `name`、`force` |

### 卷管理

| 工具 | 描述 | 关键参数 |
|------|------|----------|
| `volume_list` | 列出所有卷 | `format`、`quiet` |
| `volume_create` | 创建命名卷 | `name`、`driver`、`opt`、`label` |
| `volume_remove` | 删除卷 | `name`、`force` |

### 仓库认证

| 工具 | 描述 | 关键参数 |
|------|------|----------|
| `registry_login` | 登录仓库 | `server`、`username`、`password`、`passwordStdin` |
| `registry_logout` | 登出仓库 | `server` |

> **安全性：** 建议使用 `passwordStdin` 替代 `password`，避免凭据暴露在进程列表中。

### 系统

| 工具 | 描述 | 关键参数 |
|------|------|----------|
| `system_version` | 获取 wslc CLI 版本 | — |
| `system_prune` | 删除所有已停止的容器 | — |

---

## 示例提示

```
列出所有正在运行的 WSL 容器。
显示 wslc 版本。
有哪些容器镜像可用？以 JSON 格式显示。
从 ubuntu:24.04 创建一个名为 "web-test" 的容器，1 个 CPU，512M 内存。
在后台运行 nginx，发布 8080 端口。
查看 "web-test" 容器的最后 50 行日志。
以 JSON 格式获取所有运行中容器的统计信息。
拉取 alpine:latest 并从中创建容器。
将 ubuntu:24.04 标记为 my-ubuntu:latest。
创建名为 "backend" 的网络，并在其中运行容器。
```

---

## 项目结构

```
mcp-server-wslc/
├── src/
│   ├── index.ts                     # 入口
│   ├── server.ts                    # McpServer + stdio 传输
│   ├── registry/
│   │   └── registerTools.ts         # 工具统一注册
│   ├── tools/
│   │   ├── containers/              # 11 个文件 + 1 个测试
│   │   │   ├── list.ts、create.ts、run.ts、run.test.ts、inspect.ts
│   │   │   ├── start.ts、stop.ts、restart.ts、remove.ts
│   │   │   └── logs.ts、exec.ts、stats.ts
│   │   ├── images/                  # 7 个文件
│   │   │   ├── list.ts、pull.ts、push.ts、build.ts
│   │   │   └── tag.ts、inspect.ts、remove.ts
│   │   ├── networks/                # 3 个文件
│   │   │   └── list.ts、create.ts、remove.ts
│   │   ├── volumes/                 # 3 个文件
│   │   │   └── list.ts、create.ts、remove.ts
│   │   ├── registry/                # 2 个文件
│   │   │   └── login.ts、logout.ts
│   │   └── system/                  # 2 个文件
│   │       └── version.ts、prune.ts
│   └── utils/
│       ├── wslc.ts                  # runWslc() — 唯一执行入口
│       └── wslc.test.ts             # runWslc() 单元测试
├── dist/                            # 编译产物（33 个 JS 文件）
├── vitest.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── README.zh-CN.md
```

---

## 测试

单元测试使用 [vitest](https://vitest.dev)。测试覆盖：

- **`runWslc()`** —— 执行封装：stdout/stderr 修剪、超时、ENOENT、错误传播
- **`buildContainerRunArgs()`** —— `container_run` 的 CLI 参数构建：所有参数类型及组合

```bash
npm run test           # 单次运行
npm run test:watch     # 监视模式
npm run test:coverage  # 覆盖率报告（v8）
```
---
## 许可证

ISC
