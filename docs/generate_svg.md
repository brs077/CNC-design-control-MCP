# generate_svg

**Category:** Design File Generation
**Risk Level:** None
**Requires CNCjs:** No

## Description
Generates SVG vector files from an array of shape definitions. The output SVG file can be imported into CAD/CAM software such as Carveco or Fusion 360 for further processing and toolpath generation. All dimensions are specified in millimeters.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| shapes | array | Yes | - | Array of shape objects defining the SVG content (see shape types below) |
| canvasWidth | number | Yes | - | Canvas width in mm |
| canvasHeight | number | Yes | - | Canvas height in mm |
| outputPath | string | Yes | - | File path for the generated SVG file |

### Shape Object Properties
| Property | Type | Applies To | Description |
|----------|------|------------|-------------|
| type | string | All | Shape type: `circle`, `rectangle`, `line`, `path` |
| cx | number | circle | Center X coordinate |
| cy | number | circle | Center Y coordinate |
| r | number | circle | Radius |
| x | number | rectangle | X position of top-left corner |
| y | number | rectangle | Y position of top-left corner |
| width | number | rectangle | Rectangle width |
| height | number | rectangle | Rectangle height |
| x1 | number | line | Line start X coordinate |
| y1 | number | line | Line start Y coordinate |
| x2 | number | line | Line end X coordinate |
| y2 | number | line | Line end Y coordinate |
| d | string | path | SVG path data string |
| stroke | string | All | Stroke color (e.g., `"black"`, `"#FF0000"`) |
| strokeWidth | number | All | Stroke width in mm |
| fill | string | All | Fill color (e.g., `"none"`, `"red"`) |

## Returns
The file path of the generated SVG file.

## Usage Notes
- All dimensions and coordinates are in millimeters.
- Use `fill: "none"` for cut paths intended for CNC routing.
- The generated SVG is compatible with Carveco, Fusion 360, Inkscape, and other standard vector editors.
- Path shapes accept standard SVG path data syntax (M, L, C, A, Z commands).
- Stroke and fill properties are optional; defaults are applied if omitted.
