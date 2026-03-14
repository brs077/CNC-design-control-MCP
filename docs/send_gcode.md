# send_gcode

**Category:** Control
**Risk Level:** HIGH
**Requires CNCjs:** Yes

## Description
Sends one or more lines of G-code directly to the CNC machine for immediate execution. The tool validates the commands and generates warnings for potentially dangerous operations such as spindle commands without speed values or rapid position moves.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| gcode | string or string[] | Yes | - | G-code line(s) to send to the machine |

## Returns
Confirmation that the G-code has been sent, along with any generated warnings.

## Usage Notes
- Requires an open serial port connection.
- Generates a warning when spindle commands (M3/M4) are sent without an S speed value.
- Generates a warning for rapid position moves (G28/G30) which move through machine coordinates.
- Commands are sent directly to the machine and executed immediately.
- For executing complete G-code programs, use `load_gcode` and `start_job` instead.
