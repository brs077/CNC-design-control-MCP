# generate_gcode_profile

**Category:** G-code Generation
**Risk Level:** None
**Requires CNCjs:** No (if autoLoad=false), Yes (if autoLoad=true)

## Description
Generates G-code to cut 2D profiles from basic shapes or custom point paths. The tool produces multi-pass step-down toolpaths with safe Z retracts between passes, plunge moves at 1/3 of the cutting feedrate, and automatic spindle start/stop commands. Tool compensation can be applied inside or outside the profile to account for cutter diameter.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| shape | string | Yes | - | Shape type: `circle`, `rectangle`, or `custom` |
| centerX | number | No | 0 | X coordinate of the shape center |
| centerY | number | No | 0 | Y coordinate of the shape center |
| radius | number | Conditional | - | Radius of the circle (required when shape is `circle`) |
| width | number | Conditional | - | Width of the rectangle (required when shape is `rectangle`) |
| height | number | Conditional | - | Height of the rectangle (required when shape is `rectangle`) |
| points | array | Conditional | - | Array of [x, y] coordinate pairs defining the profile (required when shape is `custom`) |
| depth | number | Yes | - | Total cut depth (positive value, mm) |
| stepDown | number | Yes | - | Depth per pass (mm) |
| feedrate | number | Yes | - | Cutting feedrate (mm/min) |
| spindleSpeed | number | Yes | - | Spindle RPM |
| toolDiameter | number | Yes | - | Diameter of the cutting tool (mm) |
| compensation | string | No | none | Tool compensation mode: `inside`, `outside`, or `none` |
| autoLoad | boolean | No | true | Automatically load the generated G-code into CNCjs |

## Returns
Generated G-code string containing the complete profile cutting program.

## Usage Notes
- Multi-pass step-down is calculated automatically from `depth` and `stepDown`; the final pass adjusts to reach exact depth.
- Plunge moves use 1/3 of the specified feedrate for safe entry into the material.
- Safe Z retracts are inserted between passes and before/after the cutting sequence.
- Spindle start (M3) and stop (M5) commands are included automatically.
- When `compensation` is set to `inside` or `outside`, the toolpath is offset by half the `toolDiameter`.
- Custom profiles defined by `points` are cut in the order the points are specified.
- Set `autoLoad` to `false` to generate G-code without requiring a CNCjs connection.
