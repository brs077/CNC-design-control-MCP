# disconnect_port

**Category:** Connection
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Closes the current serial connection to the CNC machine. Disconnects the active port without affecting the CNCjs server connection.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| *(none)* | - | - | - | This tool takes no parameters |

## Returns
Confirmation that the serial connection has been closed.

## Usage Notes
- Closes only the serial port connection; the CNCjs server connection remains active.
- Safe to call when preparing to connect to a different port or shutting down.
- No error is raised if no connection is currently open.
