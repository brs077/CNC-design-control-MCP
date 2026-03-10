// Connection tools: list ports, connect, disconnect

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { client } from "../cncjs-client.js";

function text(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

function err(s: string) {
  return { content: [{ type: "text" as const, text: s }], isError: true };
}

export function registerConnectionTools(server: McpServer): void {
  // connect_to_port
  server.tool(
    "connect_to_port",
    "Open a serial connection to a CNC controller",
    {
      port: z.string().describe("Serial port path (e.g., /dev/cu.usbmodem14201)"),
      baudrate: z.number().default(115200).describe("Baud rate (default 115200)"),
      controllerType: z.string().default("Grbl").describe("Controller type (default Grbl)"),
    },
    async ({ port, baudrate, controllerType }) => {
      try {
        // Auto-connect to CNCjs server if not already connected
        if (!client.isConnectedToServer) {
          await client.connectToServer();
        }

        if (client.connectedPort) {
          return err(`Already connected to port ${client.connectedPort}. Disconnect first.`);
        }

        await client.openPort(port, baudrate, controllerType);
        return text(`Connected to ${port} at ${baudrate} baud (${controllerType} controller).`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // disconnect_port
  server.tool(
    "disconnect_port",
    "Close the current serial connection",
    {},
    async () => {
      try {
        if (!client.connectedPort) {
          return text("No port is currently connected.");
        }
        const port = client.connectedPort;
        await client.closePort();
        return text(`Disconnected from ${port}.`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );
}
