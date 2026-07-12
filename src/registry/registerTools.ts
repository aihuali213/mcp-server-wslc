import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerContainerListTool } from "../tools/containers/list.js";
import { registerContainerCreateTool } from "../tools/containers/create.js";
import { registerContainerRunTool } from "../tools/containers/run.js";
import { registerContainerInspectTool } from "../tools/containers/inspect.js";
import { registerContainerStartTool } from "../tools/containers/start.js";
import { registerContainerStopTool } from "../tools/containers/stop.js";
import { registerContainerRestartTool } from "../tools/containers/restart.js";
import { registerContainerRemoveTool } from "../tools/containers/remove.js";
import { registerContainerLogsTool } from "../tools/containers/logs.js";
import { registerContainerExecTool } from "../tools/containers/exec.js";
import { registerContainerStatsTool } from "../tools/containers/stats.js";
import { registerImageListTool } from "../tools/images/list.js";
import { registerImagePullTool } from "../tools/images/pull.js";
import { registerImagePushTool } from "../tools/images/push.js";
import { registerImageBuildTool } from "../tools/images/build.js";
import { registerImageTagTool } from "../tools/images/tag.js";
import { registerImageInspectTool } from "../tools/images/inspect.js";
import { registerImageRemoveTool } from "../tools/images/remove.js";
import { registerNetworkListTool } from "../tools/networks/list.js";
import { registerNetworkCreateTool } from "../tools/networks/create.js";
import { registerNetworkRemoveTool } from "../tools/networks/remove.js";
import { registerVolumeListTool } from "../tools/volumes/list.js";
import { registerVolumeCreateTool } from "../tools/volumes/create.js";
import { registerVolumeRemoveTool } from "../tools/volumes/remove.js";
import { registerRegistryLoginTool } from "../tools/registry/login.js";
import { registerRegistryLogoutTool } from "../tools/registry/logout.js";
import { registerSystemVersionTool } from "../tools/system/version.js";
import { registerSystemPruneTool } from "../tools/system/prune.js";

/**
 * Register all mcp-server-wslc tools on the given server instance.
 * Each category imports from its own subdirectory under tools/.
 * Add new registration calls here as new tools are created.
 */
export function registerAllTools(server: McpServer): void {
  // Containers
  registerContainerListTool(server);
  registerContainerCreateTool(server);
  registerContainerRunTool(server);
  registerContainerInspectTool(server);
  registerContainerStartTool(server);
  registerContainerStopTool(server);
  registerContainerRestartTool(server);
  registerContainerRemoveTool(server);
  registerContainerLogsTool(server);
  registerContainerExecTool(server);
  registerContainerStatsTool(server);

  // Images
  registerImageListTool(server);
  registerImagePullTool(server);
  registerImagePushTool(server);
  registerImageBuildTool(server);
  registerImageTagTool(server);
  registerImageInspectTool(server);
  registerImageRemoveTool(server);

  // Networks
  registerNetworkListTool(server);
  registerNetworkCreateTool(server);
  registerNetworkRemoveTool(server);

  // Volumes
  registerVolumeListTool(server);
  registerVolumeCreateTool(server);
  registerVolumeRemoveTool(server);

  // Registry
  registerRegistryLoginTool(server);
  registerRegistryLogoutTool(server);

  // System
  registerSystemVersionTool(server);
  registerSystemPruneTool(server);
}
