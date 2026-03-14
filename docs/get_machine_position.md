# get_machine_position

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the current machine and work coordinate positions. This is a lighter alternative to `get_machine_state` when you only need position data without overrides, buffer status, or other state information.

## Parameters

None.

## Returns

A position object:

| Field | Type | Description |
|-------|------|-------------|
| `machinePosition` | object | Absolute machine coordinates `{x, y, z}` in mm |
| `workPosition` | object | Work coordinates `{x, y, z}` in mm |

## Example Response

```json
{
  "machinePosition": { "x": -100.000, "y": -50.000, "z": -5.000 },
  "workPosition": { "x": 0.000, "y": 0.000, "z": -5.000 }
}
```

## Usage Notes

- Requires an active serial port connection; returns an error if not connected
- Prefer this over `get_machine_state` when you only need position information
- Machine position is the absolute position relative to the machine's home/limit switches
- Work position is the position relative to the active work coordinate system (e.g., G54)
- The difference between machine and work position equals the work coordinate offset (WCO)
