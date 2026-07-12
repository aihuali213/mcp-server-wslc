# WSLC MCP Server - Implementation Guide

## Project Goal

Develop a production-quality MCP Server for Microsoft's `wslc` CLI.

The server should expose container management capabilities through the Model Context Protocol (MCP), allowing AI agents such as:

- Claude Code
- Codex CLI
- Hermes
- OpenClaw
- Cursor
- VS Code Agent

to operate WSL Containers safely.

This project is **not** a shell executor.

It is a typed API wrapper around the `wslc` CLI.

---

# Tech Stack

- Node.js >= 22
- TypeScript
- @modelcontextprotocol/sdk 1.29.x
- zod

Use ES Modules.

---

# Architecture

The project must remain maintainable after growing to 50+ tools.

Never place every tool inside index.ts.

Project layout:

src/

    index.ts

    server.ts

    registry/
        registerTools.ts

    tools/

        version.ts

        containers/
            list.ts
            inspect.ts
            create.ts
            run.ts
            exec.ts
            start.ts
            stop.ts
            restart.ts
            remove.ts
            logs.ts
            stats.ts

        images/
            list.ts
            pull.ts
            build.ts
            push.ts
            tag.ts
            inspect.ts
            remove.ts

        networks/
            list.ts
            create.ts
            remove.ts

        volumes/
            list.ts
            create.ts
            remove.ts

        registry/
            login.ts
            logout.ts

        system/
            info.ts
            prune.ts

    utils/

        wslc.ts

---

# Coding Style

Use:

McpServer

instead of the deprecated Server API.

Use:

server.registerTool(...)

for every tool.

Use async/await.

Never use exec().

Always use:

child_process.execFile()

or

child_process.spawn()

---

# Utility Layer

Create

utils/wslc.ts

This file is the only place allowed to execute wslc.

Example:

runWslc(args:string[])

returns

{
    stdout:string,
    stderr:string
}

All tools must call this helper.

Never execute wslc directly inside tools.

---

# Error Handling

Every command execution should throw typed errors.

Example:

Unable to pull image

Container not found

Image not found

Network already exists

Do not leak raw stack traces to MCP clients.

---

# Tool Registration

Each tool exports

registerXXXTool(server)

Example:

registerVersionTool(server)

registerContainerListTool(server)

registerImagePullTool(server)

registerTools.ts imports every register function.

server.ts never knows individual tools.

---

# Response Format

Always return MCP content.

Example

{
    content:[
        {
            type:"text",
            text:"..."
        }
    ]
}

Never print to stdout except debugging.

---

# Phase 1

Implement

version

maps to

wslc version

Implement

list_containers

maps to

wslc list

Implement

list_images

maps to

wslc images

---

# Phase 2

Container Management

create

run

inspect

start

stop

restart

remove

logs

exec

stats

---

# Phase 3

Image Management

pull

push

build

tag

remove

inspect

---

# Phase 4

Network

list

create

remove

---

# Phase 5

Volumes

list

create

remove

---

# Phase 6

Registry

login

logout

---

# Phase 7

System

version

info

prune

disk usage

---

# Future Features

After all CLI commands are wrapped, implement AI-oriented tools.

Examples:

deploy_nginx

deploy_postgres

deploy_redis

cleanup_unused

copy_to_container

copy_from_container

open_shell

health_check

container_summary

search_logs

backup_container

restore_container

These tools internally compose multiple wslc commands.

---

# Code Quality

Requirements:

Strict TypeScript.

No any.

No duplicated code.

One responsibility per file.

Shared logic goes into utils/.

---

# Testing

Use MCP Inspector.

Verify every tool individually.

Then verify from Claude Code.

Then verify from Codex CLI.

Then verify from Hermes/OpenClaw.

---

# Documentation

Generate

README.md

including

Installation

Build

Run

Claude Desktop configuration

Codex CLI configuration

Hermes configuration

Example prompts

Project structure

---

# Stretch Goals

If possible, implement:

JSON parsing when supported.

Streaming logs.

Cancellation support.

Long-running task support.

Progress reporting.

Timeout configuration.

Automatic retries.
