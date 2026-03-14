# generate_gcode_drill

**Category:** G-code Generation
**Risk Level:** None
**Requires CNCjs:** No (if autoLoad=false), Yes (if autoLoad=true)

## Description
Generates G-code for drilling patterns including grids, circular bolt patterns, and custom hole locations. Supports both standard drilling and peck drilling cycles, where the tool retracts between pecks to clear chips from the hole and prevent bit binding.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| pattern | string | Yes | - | Drilling pattern: `grid`, `circle`, or `custom` |
| centerX | number | No | 0 | X coordinate of the pattern center |
| centerY | number | No | 0 | Y coordinate of the pattern center |
| gridSpacingX | number | Conditional | - | Horizontal spacing between holes (required when pattern is `grid`) |
| gridSpacingY | number | Conditional | - | Vertical spacing between holes (required when pattern is `grid`) |
| gridCountX | number | Conditional | - | Number of columns (required when pattern is `grid`) |
| gridCountY | number | Conditional | - | Number of rows (required when pattern is `grid`) |
| circleRadius | number | Conditional | - | Radius of the bolt circle (required when pattern is `circle`) |
| holeCount | number | Conditional | - | Number of holes evenly spaced around the circle (required when pattern is `circle`) |
| points | array | Conditional | - | Array of [x, y] coordinate pairs for hole locations (required when pattern is `custom`) |
| depth | number | Yes | - | Total drilling depth (positive value, mm) |
| peckDepth | number | No | - | Depth per peck for peck drilling (mm); omit for standard drilling |
| feedrate | number | Yes | - | Drilling feedrate (mm/min) |
| spindleSpeed | number | Yes | - | Spindle RPM |
| autoLoad | boolean | No | true | Automatically load the generated G-code into CNCjs |

## Returns
Generated G-code string containing the complete drilling program.

## Usage Notes
- When `peckDepth` is specified, peck drilling is used: the tool drills to the peck depth, retracts fully for chip clearing, then re-enters to continue drilling.
- When `peckDepth` is omitted, standard drilling plunges to full depth in a single pass.
- Grid patterns are centered on the specified `centerX`/`centerY` coordinates.
- Circle patterns distribute holes evenly around the bolt circle starting from the 0-degree position.
- Custom patterns drill holes in the order the points are specified.
- Safe Z retracts are inserted between each hole location.
