# list_serial_ports

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Lists all available serial ports on the system. Use this to discover which USB/serial ports are available for connecting to your CNC controller.

## Parameters

None.

## Returns

An array of serial port objects:

| Field | Type | Description |
|-------|------|-------------|
| `port` | string | Port path (e.g., `COM3`, `/dev/ttyUSB0`, `/dev/cu.usbmodem14201`) |
| `manufacturer` | string | USB device manufacturer (if available) |
| `inuse` | boolean | Whether the port is already in use |

## Example Response

```json
[
  { "port": "COM3", "manufacturer": "CH340", "inuse": false },
  { "port": "COM5", "manufacturer": "FTDI", "inuse": true }
]
```

## Usage Notes

- Call this before `connect_to_port` to find the correct port for your CNC machine
- FoxAlien boards typically use CH340 or CP210x USB-to-serial chips
- On Windows, ports appear as `COM3`, `COM4`, etc.
- On macOS, ports appear as `/dev/cu.usbmodem*` or `/dev/cu.SLAB_USBtoUART`
- On Linux, ports appear as `/dev/ttyUSB0` or `/dev/ttyACM0`
