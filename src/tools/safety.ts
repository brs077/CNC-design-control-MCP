// Critical safety tools: emergency stop, feed hold

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { client } from "../cncjs-client.js";

function text(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

function err(s: string) {
  return { content: [{ type: "text" as const, text: s }], isError: true };
}

export function registerSafetyTools(server: McpServer): void {
  // emergency_stop — ALWAYS available if port is open
  server.tool(
    "emergency_stop",
    "EMERGENCY STOP — immediately halts all motion via GRBL soft reset (0x18). Use in any dangerous situation.",
    {},
    async () => {
      try {
        client.emergencyStop();
        return text(
          "⚠ EMERGENCY STOP SENT (soft reset 0x18).\n" +
          "All motion halted immediately.\n" +
          "Machine is now in Alarm state.\n" +
          "Use unlock_machine ($X) to clear, or home_machine ($H) to re-home."
        );
      } catch (e: any) {
        return err("EMERGENCY STOP FAILED: " + e.message);
      }
    }
  );

  // feed_hold — controlled deceleration
  server.tool(
    "feed_hold",
    "Feed hold — controlled deceleration to stop. Safer than emergency stop for non-critical situations.",
    {},
    async () => {
      try {
        client.feedHold();
        return text(
          "Feed hold sent (!). Machine is decelerating to a controlled stop.\n" +
          "Use resume_job to continue, or stop_job to cancel."
        );
      } catch (e: any) {
        return err("Feed hold failed: " + e.message);
      }
    }
  );

  // jog_cancel — cancel in-progress jog without alarm
  server.tool(
    "jog_cancel",
    "Cancel an in-progress jog. Stops motion with controlled deceleration without triggering alarm state.",
    {},
    async () => {
      try {
        client.jogCancel();
        return text("Jog cancel sent (0x85). Machine will decelerate to a stop.");
      } catch (e: any) {
        return err("Jog cancel failed: " + e.message);
      }
    }
  );
}
