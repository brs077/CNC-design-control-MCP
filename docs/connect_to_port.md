# connect_to_port

**Category:** Connection
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Opens a serial connection to a CNC machine through the specified port. Automatically connects to the CNCjs server if not already connected. Returns an error if a serial connection is already open.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| port | string | Yes | - | Serial port path to connect to (e.g., /dev/ttyUSB0) |
| baudrate | number | No | 115200 | Communication baud rate for the serial connection |
| controllerType | string | No | "Grbl" | Type of CNC controller to use |

## Returns
Confirmation of successful serial connection to the specified port.

## Usage Notes
- Auto-connects to the CNCjs server if not already connected before opening the serial port.
- Will return an error if a serial connection is already open; disconnect first before connecting to a different port.
- The default baud rate of 115200 is standard for most Grbl-based controllers.
