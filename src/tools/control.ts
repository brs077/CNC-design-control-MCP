// Control tools: G-code, job control, jog, homing, overrides

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { client } from "../cncjs-client.js";

function text(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

function err(s: string) {
  return { content: [{ type: "text" as const, text: s }], isError: true };
}

export function registerControlTools(server: McpServer): void {
  // send_gcode
  server.tool(
    "send_gcode",
    "Send one or more G-code lines to the machine. HIGH RISK — causes physical motion.",
    {
      gcode: z
        .union([z.string(), z.array(z.string())])
        .describe("G-code line(s) to send (string or array of strings)"),
    },
    async ({ gcode }) => {
      try {
        client.ensurePortOpen();
        const lines = Array.isArray(gcode) ? gcode : [gcode];

        // Safety warnings
        const warnings: string[] = [];
        for (const line of lines) {
          const upper = line.toUpperCase().trim();
          if (upper.match(/M3|M4/) && !upper.includes("S")) {
            warnings.push(`Warning: ${line} — spindle command without speed (S value)`);
          }
          if (upper.match(/G28|G30/) && !upper.match(/G28\.1|G30\.1/)) {
            warnings.push(`Warning: ${line} — rapid move to predefined position`);
          }
        }

        client.sendGcode(lines);

        let msg = `Sent ${lines.length} G-code line(s):\n${lines.join("\n")}`;
        if (warnings.length > 0) {
          msg += "\n\n" + warnings.join("\n");
        }
        return text(msg);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // load_gcode
  server.tool(
    "load_gcode",
    "Load G-code content into CNCjs for execution",
    {
      name: z.string().describe("File name for the G-code"),
      content: z.string().describe("G-code content to load"),
    },
    async ({ name, content }) => {
      try {
        client.loadGcode(name, content);
        const lineCount = content.split("\n").length;
        return text(`Loaded "${name}" (${lineCount} lines). Use start_job to begin execution.`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // start_job
  server.tool(
    "start_job",
    "Start executing the loaded G-code program",
    {},
    async () => {
      try {
        client.ensurePortOpen();
        if (!client.gcodeFile) {
          return err("No G-code file is loaded. Use load_gcode first.");
        }
        if (client.activeState !== "Idle") {
          return err(`Cannot start job — machine is in ${client.activeState} state. Must be Idle.`);
        }
        client.startJob();
        return text(`Job started: ${client.gcodeFile}`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // pause_job
  server.tool(
    "pause_job",
    "Pause the current job (feed hold + pause sender)",
    {},
    async () => {
      try {
        client.ensurePortOpen();
        client.pauseJob();
        return text("Job paused. Use resume_job to continue or stop_job to cancel.");
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // resume_job
  server.tool(
    "resume_job",
    "Resume a paused job",
    {},
    async () => {
      try {
        client.ensurePortOpen();
        client.resumeJob();
        return text("Job resumed.");
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // stop_job
  server.tool(
    "stop_job",
    "Stop the current job",
    {
      force: z
        .boolean()
        .default(false)
        .describe("Force stop with soft reset (true) or graceful stop (false)"),
    },
    async ({ force }) => {
      try {
        client.ensurePortOpen();
        client.stopJob(force);
        return text(force ? "Job force-stopped (soft reset sent)." : "Job stopped gracefully.");
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // home_machine
  server.tool(
    "home_machine",
    "Run GRBL homing cycle ($H). Machine must have homing switches enabled.",
    {},
    async () => {
      try {
        client.ensurePortOpen();
        const state = client.activeState;
        if (state === "Run" || state === "Jog") {
          return err(`Cannot home while machine is in ${state} state.`);
        }
        client.home();
        return text("Homing cycle started ($H). Machine will seek limit switches.");
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // unlock_machine
  server.tool(
    "unlock_machine",
    "Clear GRBL alarm state ($X). Use after resolving the cause of the alarm.",
    {},
    async () => {
      try {
        client.ensurePortOpen();
        client.unlock();
        return text("Alarm cleared ($X). Machine unlocked.");
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // jog
  server.tool(
    "jog",
    "Jog the machine incrementally. HIGH RISK — causes physical motion.",
    {
      axis: z.enum(["X", "Y", "Z", "x", "y", "z"]).describe("Axis to jog"),
      distance: z.number().describe("Distance to jog in current units (mm or inches)"),
      feedrate: z.number().positive().describe("Feedrate in mm/min (or inches/min)"),
    },
    async ({ axis, distance, feedrate }) => {
      try {
        client.ensurePortOpen();
        const state = client.activeState;
        if (state !== "Idle" && state !== "Jog") {
          return err(`Cannot jog — machine is in ${state} state. Must be Idle or Jog.`);
        }

        // Sanity check distance
        if (Math.abs(distance) > 1000) {
          return err(`Jog distance ${distance} seems too large. Max recommended: 1000mm.`);
        }

        client.jog(axis.toUpperCase(), distance, feedrate);
        return text(`Jogging ${axis.toUpperCase()} by ${distance} at F${feedrate}`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // set_feed_override
  server.tool(
    "set_feed_override",
    "Adjust feed rate override (10-200%)",
    {
      value: z
        .number()
        .min(10)
        .max(200)
        .describe("Feed rate override percentage (10-200)"),
    },
    async ({ value }) => {
      try {
        client.ensurePortOpen();
        client.setFeedOverride(value);
        return text(`Feed override set to ${value}%.`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // set_spindle_override
  server.tool(
    "set_spindle_override",
    "Adjust spindle speed override (10-200%)",
    {
      value: z
        .number()
        .min(10)
        .max(200)
        .describe("Spindle speed override percentage (10-200)"),
    },
    async ({ value }) => {
      try {
        client.ensurePortOpen();
        client.setSpindleOverride(value);
        return text(`Spindle override set to ${value}%.`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );
}
