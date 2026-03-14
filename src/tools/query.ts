// 14 read-only query tools

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { client } from "../cncjs-client.js";
import { GRBL_SETTINGS_MAP, GRBL_ALARMS, GRBL_ERRORS } from "../types.js";

function text(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

function json(obj: unknown) {
  return text(JSON.stringify(obj, null, 2));
}

function err(s: string) {
  return { content: [{ type: "text" as const, text: s }], isError: true };
}

export function registerQueryTools(server: McpServer): void {
  // 1. list_serial_ports
  server.tool(
    "list_serial_ports",
    "List available serial ports",
    {},
    async () => {
      try {
        const ports = await client.listPorts();
        if (ports.length === 0) return text("No serial ports found.");
        return json(ports);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // 2. get_connection_status
  server.tool(
    "get_connection_status",
    "Get current CNCjs connection status",
    {},
    async () => {
      return json({
        connectedToServer: client.isConnectedToServer,
        serialPort: client.connectedPort,
        controllerType: client.controllerType,
      });
    }
  );

  // 3. get_machine_state
  server.tool(
    "get_machine_state",
    "Get full GRBL machine state (positions, feed, spindle, overrides, buffer)",
    {},
    async () => {
      if (!client.isPortOpen()) return err("No serial port connected.");
      return json({
        activeState: client.status.activeState,
        machinePosition: client.status.mpos,
        workPosition: client.status.wpos,
        workCoordinateOffset: client.status.wco,
        overrides: {
          feed: client.status.ov[0] + "%",
          rapid: client.status.ov[1] + "%",
          spindle: client.status.ov[2] + "%",
        },
        buffer: client.status.buf,
        feedrate: client.status.feedrate,
        spindleSpeed: client.status.spindle,
      });
    }
  );

  // 4. get_machine_position
  server.tool(
    "get_machine_position",
    "Get current machine and work positions (X, Y, Z)",
    {},
    async () => {
      if (!client.isPortOpen()) return err("No serial port connected.");
      return json({
        machinePosition: client.status.mpos,
        workPosition: client.status.wpos,
      });
    }
  );

  // 5. get_work_coordinate_offset
  server.tool(
    "get_work_coordinate_offset",
    "Get work coordinate offset (WCO) values",
    {},
    async () => {
      if (!client.isPortOpen()) return err("No serial port connected.");
      return json({
        wco: client.status.wco,
        activeWCS: client.parserState.modal.wcs,
      });
    }
  );

  // 6. get_machine_settings
  server.tool(
    "get_machine_settings",
    "Get all GRBL $$ machine settings with labels",
    {},
    async () => {
      if (!client.isPortOpen()) return err("No serial port connected.");
      const settings = client.settings;
      if (Object.keys(settings).length === 0) {
        return text("No settings cached. Try sending $$ to the machine first.");
      }
      const labeled = Object.entries(settings).map(([key, value]) => ({
        setting: key,
        value,
        description: GRBL_SETTINGS_MAP[key] || "Unknown setting",
      }));
      return json(labeled);
    }
  );

  // 7. get_parser_state
  server.tool(
    "get_parser_state",
    "Get active G-code parser state (WCS, units, distance mode, etc.)",
    {},
    async () => {
      if (!client.isPortOpen()) return err("No serial port connected.");
      const ps = client.parserState;
      return json({
        motionMode: ps.modal.motion,
        coordinateSystem: ps.modal.wcs,
        plane: ps.modal.plane,
        units: ps.modal.units === "G20" ? "inches" : "mm",
        distanceMode: ps.modal.distance === "G90" ? "absolute" : "incremental",
        feedrateMode: ps.modal.feedrate,
        spindleState: ps.modal.spindle,
        coolantState: ps.modal.coolant,
        activeTool: ps.tool,
        feedrate: ps.feedrate,
        spindleSpeed: ps.spindle,
      });
    }
  );

  // 8. get_loaded_gcode
  server.tool(
    "get_loaded_gcode",
    "Get currently loaded G-code file name and content",
    {},
    async () => {
      const name = client.gcodeFile;
      const content = client.gcodeContent;
      if (!name) return text("No G-code file is loaded.");
      const lines = content?.split("\n") || [];
      return json({
        fileName: name,
        lineCount: lines.length,
        content: lines.length > 500
          ? lines.slice(0, 500).join("\n") + `\n... (${lines.length - 500} more lines)`
          : content,
      });
    }
  );

  // 9. get_job_progress
  server.tool(
    "get_job_progress",
    "Get current job progress (lines sent, elapsed time, % complete)",
    {},
    async () => {
      const sender = client.senderStatus;
      if (!sender) return text("No job is running.");
      const pct = sender.total > 0 ? ((sender.sent / sender.total) * 100).toFixed(1) : "0";
      return json({
        fileName: sender.name,
        progress: pct + "%",
        linesSent: sender.sent,
        linesTotal: sender.total,
        elapsedTime: formatMs(sender.elapsedTime),
        remainingTime: formatMs(sender.remainingTime),
        workflowState: client.workflowState,
      });
    }
  );

  // 10. get_workflow_state
  server.tool(
    "get_workflow_state",
    "Get workflow state (idle, running, paused)",
    {},
    async () => {
      return json({
        workflowState: client.workflowState,
        activeState: client.isPortOpen() ? client.activeState : "disconnected",
      });
    }
  );

  // 11. get_feeder_status
  server.tool(
    "get_feeder_status",
    "Get feeder queue depth, hold state, and reason",
    {},
    async () => {
      return json(client.feederStatus);
    }
  );

  // 12. list_macros
  server.tool(
    "list_macros",
    "List all CNCjs macros (name, id, content)",
    {},
    async () => {
      try {
        const macros = await client.fetchMacros();
        if (macros.length === 0) return text("No macros defined.");
        return json(macros);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // 13. list_machines
  server.tool(
    "list_machines",
    "List machine profiles with travel limits",
    {},
    async () => {
      try {
        const machines = await client.fetchMachines();
        if (machines.length === 0) return text("No machine profiles defined.");
        return json(machines);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // 14. get_alarm_info
  server.tool(
    "get_alarm_info",
    "Get current alarm code and human-readable meaning",
    {},
    async () => {
      if (!client.isPortOpen()) return err("No serial port connected.");
      const code = client.alarmCode;
      if (code === null && client.activeState !== "Alarm") {
        return text("No alarm is active. Machine state: " + client.activeState);
      }
      return json({
        alarmActive: client.activeState === "Alarm",
        alarmCode: code,
        meaning: code !== null ? (GRBL_ALARMS[code] || "Unknown alarm code") : "Alarm state with unknown code",
        resolution: "Use unlock_machine ($X) to clear, or home_machine ($H) if position is lost.",
      });
    }
  );
  // 15. get_console_output
  server.tool(
    "get_console_output",
    "Get recent serial console output (GRBL responses, errors, probe results, sent commands)",
    {
      lines: z
        .number()
        .min(1)
        .max(200)
        .default(50)
        .describe("Number of recent lines to return (default 50)"),
    },
    async ({ lines }) => {
      const buffer = client.consoleOutput;
      if (buffer.length === 0) return text("No console output captured yet.");
      const recent = buffer.slice(-lines);
      return text(recent.join("\n"));
    }
  );

  // 16. get_error_info
  server.tool(
    "get_error_info",
    "Get last GRBL error code and human-readable meaning",
    {},
    async () => {
      const code = client.lastErrorCode;
      if (code === null) {
        return text("No GRBL error recorded.");
      }
      return json({
        errorCode: code,
        meaning: GRBL_ERRORS[code] || "Unknown error code",
      });
    }
  );
}

function formatMs(ms: number): string {
  if (!ms || ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}
