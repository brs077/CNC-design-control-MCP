# load_gcode

**Category:** Control
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Loads G-code content into the CNCjs sender for later execution. This tool only loads the program; it does not execute it. Use `start_job` to begin execution after loading.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| name | string | Yes | - | Name to identify the loaded G-code program |
| content | string | Yes | - | The G-code content to load |

## Returns
Confirmation that the G-code has been loaded into the sender.

## Usage Notes
- Does NOT execute the G-code; use `start_job` after loading to begin execution.
- The name parameter is used to identify the loaded program in the CNCjs interface.
- Loading new G-code replaces any previously loaded program.
- Requires an active connection to the CNCjs server.
