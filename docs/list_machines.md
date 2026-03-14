# list_machines

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns all machine profiles configured in CNCjs. Machine profiles define the physical dimensions and travel limits of each machine. Use this to check available machines and their working envelopes.

## Parameters

None.

## Returns

An array of machine profile objects:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the machine profile |
| `name` | string | Human-readable name of the machine |
| `limits` | object | Travel limits: `{xmin, xmax, ymin, ymax, zmin, zmax}` in mm |

## Example Response

```json
[
  {
    "id": "machine001",
    "name": "FoxAlien Masuter 4040",
    "limits": {
      "xmin": 0,
      "xmax": 400,
      "ymin": 0,
      "ymax": 400,
      "zmin": -80,
      "zmax": 0
    }
  }
]
```

## Usage Notes

- Machine profiles are stored in CNCjs and do not require an active serial port connection
- Use the limits to validate that G-code stays within the machine's working envelope before running a job
- The `analyze_gcode` tool can provide bounding box data to compare against these limits
- Limit values define the physical travel range of the machine in millimeters
