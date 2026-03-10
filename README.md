# CNCjs MCP Server

MCP server bridging Claude Code to CNCjs for GRBL CNC control (FoxAlien XE Ultra).

## Architecture

```
Claude Code ←stdio/MCP→ cncjs-mcp (Node.js) ←Socket.IO v1→ CNCjs :8000 ←USB Serial→ GRBL
```

## Tools (30 total)

### Read-Only (14)
`list_serial_ports`, `get_connection_status`, `get_machine_state`, `get_machine_position`, `get_work_coordinate_offset`, `get_machine_settings`, `get_parser_state`, `get_loaded_gcode`, `get_job_progress`, `get_workflow_state`, `get_feeder_status`, `list_macros`, `list_machines`, `get_alarm_info`

### Control (11)
`connect_to_port`, `disconnect_port`, `load_gcode`, `start_job`, `pause_job`, `resume_job`, `stop_job`, `home_machine`, `unlock_machine`, `set_feed_override`, `set_spindle_override`

### Direct Motion (3)
`send_gcode`, `jog`, `run_macro`

### Critical Safety (2)
`emergency_stop` (soft reset 0x18), `feed_hold`

## Windows PC Setup for CNCjs

1. **Node.js** (LTS recommended, v18+) — download from https://nodejs.org
2. **CNCjs** — install via npm after Node.js is set up:
   ```
   npm install -g cncjs
   ```
   Or download the desktop app installer from the CNCjs GitHub releases page.

3. **USB/Serial driver for your FoxAlien XE Ultra** — likely one of:
   - **CH340** driver (most common on FoxAlien boards) — download from the manufacturer site
   - **CP210x** driver (if it uses a SiLabs chip)
   - Windows 10/11 may auto-install these, but if your board doesn't show up in Device Manager under "Ports (COM & LPT)", install the driver manually

**Quick start after install:**
```
cncjs
```
Then open `http://localhost:8000` in your browser. Your FoxAlien will show up as a COM port (e.g., `COM3`). Select it, set baud rate to `115200`, controller type `Grbl`, and connect.

**Optional but recommended:**
- **Chrome/Edge** — CNCjs web UI works best in Chromium browsers
- **Python** (sometimes needed for `node-gyp` native module builds during npm install)

## MCP Server Setup

```bash
npm install
npm run build
```

Register with Claude Code:
```bash
claude mcp add cncjs-mcp node /path/to/cncjs-mcp/build/index.js
```

### Environment Variables
- `CNCJS_URL` — CNCjs server URL (default: `http://localhost:8000`)
- `CNCJS_TOKEN` — Optional JWT token for CNCjs authentication
