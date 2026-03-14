# generate_gcode_pocket

**Category:** G-code Generation
**Risk Level:** None
**Requires CNCjs:** No (if autoLoad=false), Yes (if autoLoad=true)

## Description
Generates G-code to clear rectangular or circular pockets by removing all material within the defined boundary. Rectangular pockets use a zigzag raster clearing strategy, while circular pockets use a spiral-outward pattern followed by a final perimeter pass for a clean edge finish.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| shape | string | Yes | - | Pocket shape: `rectangle` or `circle` |
| centerX | number | No | 0 | X coordinate of the pocket center |
| centerY | number | No | 0 | Y coordinate of the pocket center |
| width | number | Conditional | - | Width of the pocket (required when shape is `rectangle`) |
| height | number | Conditional | - | Height of the pocket (required when shape is `rectangle`) |
| radius | number | Conditional | - | Radius of the pocket (required when shape is `circle`) |
| depth | number | Yes | - | Total pocket depth (positive value, mm) |
| stepDown | number | Yes | - | Depth per pass (mm) |
| stepOver | number | No | 40 | Tool stepover percentage (10-90%) |
| feedrate | number | Yes | - | Cutting feedrate (mm/min) |
| spindleSpeed | number | Yes | - | Spindle RPM |
| toolDiameter | number | Yes | - | Diameter of the cutting tool (mm) |
| autoLoad | boolean | No | true | Automatically load the generated G-code into CNCjs |

## Returns
Generated G-code string containing the complete pocket clearing program.

## Usage Notes
- Rectangular pockets use a zigzag raster pattern, alternating direction on each row for efficient clearing.
- Circular pockets use a spiral-outward strategy starting from the center, followed by a final perimeter pass to ensure a clean pocket wall.
- The `stepOver` parameter controls the overlap between adjacent passes as a percentage of the tool diameter; valid range is 10-90%.
- Lower stepover values produce a smoother floor finish but increase machining time.
- Multi-pass step-down is applied automatically based on `depth` and `stepDown`.
- The toolpath accounts for tool radius to avoid overcutting the pocket boundary.
