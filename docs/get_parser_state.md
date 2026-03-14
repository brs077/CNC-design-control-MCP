# get_parser_state

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the active G-code parser modal state, showing which G-code modes are currently in effect. Use this to understand the machine's current interpretation context before sending G-code commands.

## Parameters

None.

## Returns

A parser state object:

| Field | Type | Description |
|-------|------|-------------|
| `motionMode` | string | Active motion mode: `G0` (rapid), `G1` (linear), `G2` (CW arc), `G3` (CCW arc) |
| `coordinateSystem` | string | Active WCS: `G54`, `G55`, `G56`, `G57`, `G58`, or `G59` |
| `plane` | string | Active plane: `G17` (XY), `G18` (XZ), or `G19` (YZ) |
| `units` | string | Active units: `mm` or `inches` |
| `distanceMode` | string | Distance mode: `absolute` or `incremental` |
| `feedrateMode` | string | Feedrate mode (e.g., `G94` units per minute) |
| `spindleState` | string | Spindle state: `M3` (CW), `M4` (CCW), or `M5` (off) |
| `coolantState` | string | Coolant state: `M7` (mist), `M8` (flood), or `M9` (off) |
| `activeTool` | number | Currently active tool number |
| `feedrate` | number | Current feedrate value |
| `spindleSpeed` | number | Current spindle speed in RPM |

## Example Response

```json
{
  "motionMode": "G0",
  "coordinateSystem": "G54",
  "plane": "G17",
  "units": "mm",
  "distanceMode": "absolute",
  "feedrateMode": "G94",
  "spindleState": "M5",
  "coolantState": "M9",
  "activeTool": 0,
  "feedrate": 1000,
  "spindleSpeed": 0
}
```

## Usage Notes

- Requires an active serial port connection; returns an error if not connected
- Check `units` before sending feedrate values to avoid dangerous speed mismatches (mm vs inches)
- Verify `distanceMode` before sending movement commands to avoid unexpected travel
- The parser state persists across commands; a G1 sent earlier remains active until another motion mode is issued
- This reflects GRBL's internal modal state, which may differ from what your G-code file explicitly specifies
