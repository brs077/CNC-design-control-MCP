// G-code analysis tools — pure computation, no machine interaction

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { client } from "../cncjs-client.js";

function text(s: string) {
  return { content: [{ type: "text" as const, text: s }] };
}

function json(obj: unknown) {
  return text(JSON.stringify(obj, null, 2));
}

function err(s: string) {
  return { content: [{ type: "text" as const, text: s }], isError: true };
}

interface BBox {
  xMin: number; xMax: number;
  yMin: number; yMax: number;
  zMin: number; zMax: number;
}

export function registerAnalysisTools(server: McpServer): void {
  server.tool(
    "analyze_gcode",
    "Analyze loaded G-code — extract bounding box, move counts, feed rates, spindle speeds, and tools. No machine interaction, zero risk.",
    {},
    async () => {
      const content = client.gcodeContent;
      if (!content) return err("No G-code file is loaded. Use load_gcode first.");

      const lines = content.split("\n");

      // Tracking state
      let absoluteMode = true; // G90
      let currentX = 0, currentY = 0, currentZ = 0;
      const bbox: BBox = {
        xMin: 0, xMax: 0, yMin: 0, yMax: 0, zMin: 0, zMax: 0,
      };
      let rapidCount = 0;
      let linearCount = 0;
      let arcCount = 0;
      const feedrates = new Set<number>();
      const spindleSpeeds = new Set<number>();
      const toolNumbers = new Set<number>();
      const mCodes = new Set<string>();
      let totalLines = 0;
      let commentLines = 0;
      let emptyLines = 0;

      for (const rawLine of lines) {
        const line = rawLine.split(";")[0].split("(")[0].trim().toUpperCase();
        totalLines++;

        if (!line) { emptyLines++; continue; }
        if (rawLine.trim().startsWith(";") || rawLine.trim().startsWith("(")) {
          commentLines++;
          continue;
        }

        // Parse modal commands
        if (line.includes("G90")) absoluteMode = true;
        if (line.includes("G91")) absoluteMode = false;

        // Parse values
        const xMatch = line.match(/X([-\d.]+)/);
        const yMatch = line.match(/Y([-\d.]+)/);
        const zMatch = line.match(/Z([-\d.]+)/);
        const fMatch = line.match(/F([-\d.]+)/);
        const sMatch = line.match(/S([-\d.]+)/);
        const tMatch = line.match(/T(\d+)/);

        // Track feed rates and spindle speeds
        if (fMatch) feedrates.add(parseFloat(fMatch[1]));
        if (sMatch) spindleSpeeds.add(parseFloat(sMatch[1]));
        if (tMatch) toolNumbers.add(parseInt(tMatch[1]));

        // Track M-codes
        const mMatches = line.match(/M\d+/g);
        if (mMatches) mMatches.forEach((m) => mCodes.add(m));

        // Track motion
        const isRapid = line.match(/G0(?!\d)/);
        const isLinear = line.match(/G1(?!\d)/);
        const isArc = line.match(/G[23](?!\d)/);

        if (isRapid) rapidCount++;
        if (isLinear) linearCount++;
        if (isArc) arcCount++;

        // Update position and bounding box
        if (xMatch) {
          const val = parseFloat(xMatch[1]);
          currentX = absoluteMode ? val : currentX + val;
        }
        if (yMatch) {
          const val = parseFloat(yMatch[1]);
          currentY = absoluteMode ? val : currentY + val;
        }
        if (zMatch) {
          const val = parseFloat(zMatch[1]);
          currentZ = absoluteMode ? val : currentZ + val;
        }

        bbox.xMin = Math.min(bbox.xMin, currentX);
        bbox.xMax = Math.max(bbox.xMax, currentX);
        bbox.yMin = Math.min(bbox.yMin, currentY);
        bbox.yMax = Math.max(bbox.yMax, currentY);
        bbox.zMin = Math.min(bbox.zMin, currentZ);
        bbox.zMax = Math.max(bbox.zMax, currentZ);
      }

      const feedArr = Array.from(feedrates).sort((a, b) => a - b);
      const spindleArr = Array.from(spindleSpeeds).sort((a, b) => a - b);

      return json({
        fileName: client.gcodeFile,
        lines: {
          total: totalLines,
          commands: totalLines - commentLines - emptyLines,
          comments: commentLines,
          empty: emptyLines,
        },
        boundingBox: {
          x: { min: bbox.xMin, max: bbox.xMax, range: +(bbox.xMax - bbox.xMin).toFixed(3) },
          y: { min: bbox.yMin, max: bbox.yMax, range: +(bbox.yMax - bbox.yMin).toFixed(3) },
          z: { min: bbox.zMin, max: bbox.zMax, range: +(bbox.zMax - bbox.zMin).toFixed(3) },
        },
        moves: {
          rapid: rapidCount,
          linear: linearCount,
          arc: arcCount,
          total: rapidCount + linearCount + arcCount,
        },
        feedrates: feedArr.length > 0
          ? { min: feedArr[0], max: feedArr[feedArr.length - 1], values: feedArr }
          : null,
        spindleSpeeds: spindleArr.length > 0
          ? { min: spindleArr[0], max: spindleArr[spindleArr.length - 1], values: spindleArr }
          : null,
        toolNumbers: Array.from(toolNumbers).sort((a, b) => a - b),
        mCodes: Array.from(mCodes).sort(),
      });
    }
  );
}
