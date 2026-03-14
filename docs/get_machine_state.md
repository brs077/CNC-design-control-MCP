# get_machine_state

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the full GRBL machine state including position, overrides, buffer status, and active state. This is the most comprehensive status tool available and provides a complete snapshot of the machine's current condition.

## Parameters

None.

## Returns

A complete machine state object:

| Field | Type | Description |
|-------|------|-------------|
| `activeState` | string | Current state: `Idle`, `Run`, `Hold`, `Jog`, `Alarm`, `Door`, `Check`, `Home`, or `Sleep` |
| `machinePosition` | object | Absolute machine coordinates `{x, y, z}` in mm |
| `workPosition` | object | Work coordinates `{x, y, z}` in mm |
| `workCoordinateOffset` | object | WCO values `{x, y, z}` in mm |
| `overrides` | object | Override percentages `{feed, rapid, spindle}` |
| `buffer` | object | Buffer status `{planner, rx}` |
| `feedrate` | number | Current feedrate in mm/min |
| `spindleSpeed` | number | Current spindle speed in RPM |

## Example Response

```json
{
  "activeState": "Idle",
  "machinePosition": { "x": -100.000, "y": -50.000, "z": -5.000 },
  "workPosition": { "x": 0.000, "y": 0.000, "z": -5.000 },
  "workCoordinateOffset": { "x": -100.000, "y": -50.000, "z": 0.000 },
  "overrides": { "feed": 100, "rapid": 100, "spindle": 100 },
  "buffer": { "planner": 15, "rx": 128 },
  "feedrate": 0,
  "spindleSpeed": 0
}
```

## Usage Notes

- Requires an active serial port connection; returns an error if not connected
- Use this when you need a full picture of the machine's state
- If you only need position data, prefer `get_machine_position` for a lighter call
- The `activeState` field is critical for determining whether it is safe to send commands
- Override values are percentages (100 = normal, 50 = half speed, 200 = double speed)
- Buffer fields indicate available space in GRBL's planner and serial receive buffers
