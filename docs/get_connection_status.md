# get_connection_status

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the current connection status to the CNCjs server and serial port. Use this to verify that the system is properly connected before attempting to run any commands that require a serial connection.

## Parameters

None.

## Returns

A connection status object:

| Field | Type | Description |
|-------|------|-------------|
| `connectedToServer` | boolean | Whether the client is connected to the CNCjs server |
| `serialPort` | string\|null | The serial port path if connected (e.g., `/dev/ttyUSB0`), or `null` if not connected |
| `controllerType` | string\|null | The controller type (e.g., `Grbl`), or `null` if not connected |

## Example Response

```json
{
  "connectedToServer": true,
  "serialPort": "/dev/ttyUSB0",
  "controllerType": "Grbl"
}
```

## Usage Notes

- Call this first to verify connectivity before issuing any machine commands
- If `connectedToServer` is `false`, the CNCjs server may not be running
- If `serialPort` is `null`, you need to connect to a port using `connect_to_port`
- This is a lightweight check that does not communicate with the machine itself
