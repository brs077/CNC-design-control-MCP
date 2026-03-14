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

  // set_work_zero
  server.tool(
    "set_work_zero",
    "Set the work coordinate origin — zeros selected axes at the current position. HIGH RISK — affects all subsequent motion.",
    {
      axes: z
        .array(z.enum(["X", "Y", "Z"]))
        .min(1)
        .describe("Axes to zero at current position (e.g., ['X','Y'] or ['Z'])"),
      wcs: z
        .enum(["G54", "G55", "G56", "G57", "G58", "G59"])
        .default("G54")
        .describe("Work coordinate system (default G54)"),
    },
    async ({ axes, wcs }) => {
      try {
        client.ensurePortOpen();
        const state = client.activeState;
        if (state !== "Idle") {
          return err(`Cannot set work zero — machine is in ${state} state. Must be Idle.`);
        }

        const wcsMap: Record<string, number> = {
          G54: 1, G55: 2, G56: 3, G57: 4, G58: 5, G59: 6,
        };
        const pNum = wcsMap[wcs];
        const axisWords = axes.map((a) => `${a}0`).join(" ");
        const cmd = `G10 L20 P${pNum} ${axisWords}`;

        client.sendGcode(cmd);
        return text(`Work zero set: ${axes.join(", ")} zeroed in ${wcs} (${cmd})`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // spindle_control
  server.tool(
    "spindle_control",
    "Turn spindle on (CW or CCW with speed) or off. HIGH RISK — rotating tool.",
    {
      action: z.enum(["cw", "ccw", "off"]).describe("Spindle action: cw (M3), ccw (M4), or off (M5)"),
      speed: z.number().positive().optional().describe("Spindle speed in RPM (required for cw/ccw)"),
    },
    async ({ action, speed }) => {
      try {
        client.ensurePortOpen();
        if ((action === "cw" || action === "ccw") && !speed) {
          return err("Spindle speed (RPM) is required when turning spindle on.");
        }

        let cmd: string;
        if (action === "cw") {
          cmd = `M3 S${speed}`;
        } else if (action === "ccw") {
          cmd = `M4 S${speed}`;
        } else {
          cmd = "M5";
        }

        client.sendGcode(cmd);
        if (action === "off") {
          return text("Spindle stopped (M5).");
        }
        return text(`Spindle ${action.toUpperCase()} at ${speed} RPM (${cmd}).`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // coolant_control
  server.tool(
    "coolant_control",
    "Turn coolant on (mist or flood) or off.",
    {
      action: z.enum(["mist", "flood", "off"]).describe("Coolant action: mist (M7), flood (M8), or off (M9)"),
    },
    async ({ action }) => {
      try {
        client.ensurePortOpen();
        const cmdMap: Record<string, string> = { mist: "M7", flood: "M8", off: "M9" };
        const cmd = cmdMap[action];
        client.sendGcode(cmd);
        return text(`Coolant ${action} (${cmd}).`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // probe_z
  server.tool(
    "probe_z",
    "Probe Z-axis height using a touch plate. Sends G38.2 probe command downward. HIGH RISK — causes downward motion.",
    {
      touchPlateThickness: z.number().positive().describe("Touch plate thickness in mm"),
      feedrate: z.number().positive().default(100).describe("Probe feedrate in mm/min (default 100)"),
      maxDistance: z.number().positive().default(50).describe("Max probe distance downward in mm (default 50)"),
      retract: z.number().positive().default(2).describe("Retract distance after probe in mm (default 2)"),
      setZero: z.boolean().default(true).describe("Automatically set Z work zero accounting for plate thickness (default true)"),
    },
    async ({ touchPlateThickness, feedrate, maxDistance, retract, setZero }) => {
      try {
        client.ensurePortOpen();
        const state = client.activeState;
        if (state !== "Idle") {
          return err(`Cannot probe — machine is in ${state} state. Must be Idle.`);
        }

        // Send probe command
        const probeCmd = `G38.2 Z-${maxDistance} F${feedrate}`;
        client.sendGcode(probeCmd);

        // Wait for probe result
        const result = await client.waitForProbeResult(30000);

        if (!result.success) {
          return err(
            `Probe failed — no contact detected within ${maxDistance}mm.\n` +
            "Check that the touch plate is connected and the probe circuit is working.\n" +
            "Machine may be in alarm state — use get_alarm_info to check."
          );
        }

        let msg = `Probe contact at Z=${result.position.z.toFixed(3)}mm (machine coordinates).`;

        if (setZero) {
          // Set Z zero accounting for touch plate thickness
          const zeroCmd = `G10 L20 P1 Z${touchPlateThickness}`;
          client.sendGcode(zeroCmd);
          // Retract
          client.sendGcode(`G0 Z${retract}`);
          msg += `\nZ work zero set with ${touchPlateThickness}mm plate thickness (${zeroCmd}).`;
          msg += `\nRetracted to Z=${retract}mm above work zero.`;
        }

        return text(msg);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );

  // set_wcs
  server.tool(
    "set_wcs",
    "Switch the active work coordinate system (G54-G59)",
    {
      wcs: z
        .enum(["G54", "G55", "G56", "G57", "G58", "G59"])
        .describe("Work coordinate system to activate"),
    },
    async ({ wcs }) => {
      try {
        client.ensurePortOpen();
        client.sendGcode(wcs);
        return text(`Active work coordinate system switched to ${wcs}.`);
      } catch (e: any) {
        return err(e.message);
      }
    }
  );
}
