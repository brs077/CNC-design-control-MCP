// Management tools: macros, machines, run_macro

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { client } from "../cncjs-client.js";

function text(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

function err(s: string) {
  return { content: [{ type: "text" as const, text: s }], isError: true };
}

export function registerManagementTools(server: McpServer): void {
  // run_macro
  server.tool(
    "run_macro",
    "Execute a CNCjs macro by name or ID. HIGH RISK — macro content may cause motion.",
    {
      identifier: z
        .string()
        .describe("Macro name or ID to execute"),
    },
    async ({ identifier }) => {
      try {
        client.ensurePortOpen();

        // Try to find the macro
        const macros = await client.fetchMacros();
        const macro = macros.find(
          (m) => m.id === identifier || m.name.toLowerCase() === identifier.toLowerCase()
        );

        if (!macro) {
          const available = macros.map((m) => `  - ${m.name} (${m.id})`).join("\n");
          return err(
            `Macro "${identifier}" not found.\n\nAvailable macros:\n${available || "  (none)"}`
          );
        }

        client.runMacro(macro.id);
        return text(
          `Running macro: ${macro.name}\n\nContent:\n${macro.content}`
        );
      } catch (e: any) {
        return err(e.message);
      }
    }
  );
}
