# analyze_gcode

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Analyzes the currently loaded G-code file and returns detailed statistics including bounding box dimensions, move counts by type, feedrate ranges, spindle speeds, tool numbers, and line breakdowns. This is a pure computation tool that does not interact with the machine, making it safe to run at any time.

## Parameters

None.

## Returns

A G-code analysis object:

| Field | Type | Description |
|-------|------|-------------|
| `boundingBox` | object | Axis extents `{x: {min, max, range}, y: {min, max, range}, z: {min, max, range}}` in mm |
| `moveCounts` | object | Move counts `{rapid, linear, arc, total}` |
| `feedrates` | object | Feedrate stats `{min, max, values}` where `values` is an array of unique feedrates |
| `spindleSpeeds` | array | Array of unique spindle speeds used in the program |
| `toolNumbers` | array | Array of tool numbers referenced in the program |
| `mCodes` | array | Array of M-codes used in the program |
| `lineCounts` | object | Line breakdown `{total, commands, comments, empty}` |

## Example Response

```json
{
  "boundingBox": {
    "x": { "min": 0.000, "max": 150.000, "range": 150.000 },
    "y": { "min": 0.000, "max": 100.000, "range": 100.000 },
    "z": { "min": -5.000, "max": 10.000, "range": 15.000 }
  },
  "moveCounts": {
    "rapid": 45,
    "linear": 892,
    "arc": 36,
    "total": 973
  },
  "feedrates": {
    "min": 100,
    "max": 1500,
    "values": [100, 500, 1000, 1500]
  },
  "spindleSpeeds": [0, 12000],
  "toolNumbers": [1],
  "mCodes": ["M3", "M5", "M8", "M9"],
  "lineCounts": {
    "total": 1250,
    "commands": 973,
    "comments": 152,
    "empty": 125
  }
}
```

## Usage Notes

- Requires G-code to be loaded in CNCjs; returns an error if no file is loaded
- Pure computation with no machine interaction, so it is safe to call at any time
- Compare the `boundingBox` against `list_machines` limits to verify the job fits within the machine's working envelope
- Use `feedrates.max` to check whether the program exceeds your machine's capabilities
- The `moveCounts` breakdown helps estimate job complexity and runtime
- The `mCodes` array is useful for identifying whether the program uses spindle, coolant, or tool change commands
