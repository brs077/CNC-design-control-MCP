# generate_gcode_facing

**Category:** G-code Generation
**Risk Level:** None
**Requires CNCjs:** No (if autoLoad=false), Yes (if autoLoad=true)

## Description
Generates G-code for surface facing and leveling operations. Uses a raster pattern starting from the origin to skim material from the top of a workpiece, producing a flat and even surface. Useful for flattening stock material, spoilboards, or creating a reference surface.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| width | number | Yes | - | Width of the area to face (mm, X axis) |
| height | number | Yes | - | Height of the area to face (mm, Y axis) |
| depth | number | Yes | - | Total depth to remove (positive value, mm) |
| stepOver | number | No | 50 | Tool stepover percentage (%) |
| feedrate | number | Yes | - | Cutting feedrate (mm/min) |
| spindleSpeed | number | Yes | - | Spindle RPM |
| toolDiameter | number | Yes | - | Diameter of the cutting tool (mm) |
| autoLoad | boolean | No | true | Automatically load the generated G-code into CNCjs |

## Returns
Generated G-code string containing the complete facing program.

## Usage Notes
- The raster pattern starts from the origin (0, 0) and covers the specified width and height.
- The `stepOver` percentage controls the overlap between adjacent passes; 50% provides a good balance between finish quality and speed.
- If `depth` exceeds a single-pass capability, multiple passes at safe step-down increments are generated.
- The facing operation moves in alternating X-direction rows for efficient material removal.
- Commonly used for spoilboard surfacing and stock preparation before detailed machining.
