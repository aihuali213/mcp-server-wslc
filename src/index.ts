#!/usr/bin/env node
import { startServer } from "./server.js";

startServer().catch((error) => {
  console.error("Failed to start mcp-server-wslc:", error);
  process.exit(1);
});
