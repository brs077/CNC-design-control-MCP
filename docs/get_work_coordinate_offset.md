# get_work_coordinate_offset

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the current work coordinate offset (WCO) values and the active work coordinate system. Use this to understand the offset between machine coordinates and work coordinates, and to verify which coordinate system (G54-G59) is active.

## Parameters

None.

## Returns

A work coordinate offset object:

| Field | Type | Description |
|-------|------|-------------|
| `workCoordinateOffset` | object | WCO values `{x, y, z}` in mm |
| `activeCoordinateSystem` | string | Active WCS, one of `G54`, `G55`, `G56`, `G57`, `G58`, or `G59` |

## Example Response

```json
{
  "workCoordinateOffset": { "x": -100.000, "y": -50.000, "z": 0.000 },
  "activeCoordinateSystem": "G54"
}
```

## Usage Notes

- Requires an active serial port connection; returns an error if not connected
- WCO defines the relationship: work position = machine position - WCO
- G54 is the default and most commonly used work coordinate system
- After zeroing your work position, the WCO reflects where the work origin sits in machine space
- Use this to verify your work origin is set correctly before starting a job
