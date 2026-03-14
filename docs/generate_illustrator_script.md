# generate_illustrator_script

**Category:** Adobe Illustrator Integration
**Risk Level:** None
**Requires CNCjs:** No

## Description
Generates Adobe Illustrator ExtendScript (.jsx) files for programmatic creation of vector artwork. Supports a variety of shape types with full control over positioning, dimensions, and styling. The generated scripts can be executed within Illustrator to produce designs ready for CNC export.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| shapes | array | Yes | - | Array of shape objects defining the artwork (see shape types below) |
| canvasWidth | number | Yes | - | Canvas width in mm |
| canvasHeight | number | Yes | - | Canvas height in mm |
| exportPath | string | No | - | Export file path (`.svg`, `.dxf`, `.pdf`, `.eps`, or `.ai`) |
| outputScript | string | Yes | - | Output file path for the generated ExtendScript (`.jsx`) |

### Shape Object Properties
| Property | Type | Applies To | Description |
|----------|------|------------|-------------|
| type | string | All | Shape type: `rectangle`, `rounded_rectangle`, `circle`, `ellipse`, `polygon`, `star`, `line`, `path`, or `text` |
| x | number | All | X position (mm) |
| y | number | All | Y position (mm) |
| width | number | rectangle, rounded_rectangle, ellipse | Width (mm) |
| height | number | rectangle, rounded_rectangle, ellipse | Height (mm) |
| cornerRadius | number | rounded_rectangle | Corner radius (mm) |
| radius | number | circle, polygon, star | Radius (mm) |
| innerRadius | number | star | Inner radius for star points (mm) |
| sides | number | polygon | Number of sides |
| points | number | star | Number of star points |
| x1 | number | line | Line start X coordinate (mm) |
| y1 | number | line | Line start Y coordinate (mm) |
| x2 | number | line | Line end X coordinate (mm) |
| y2 | number | line | Line end Y coordinate (mm) |
| d | string | path | SVG-style path data string |
| text | string | text | Text content |
| fontSize | number | text | Font size in points |
| fontFamily | string | text | Font family name |
| stroke | string | All | Stroke color (e.g., `"black"`, `"#FF0000"`) |
| strokeWidth | number | All | Stroke width (mm) |
| fill | string | All | Fill color (e.g., `"none"`, `"red"`) |

## Returns
The file path of the generated ExtendScript file.

## Usage Notes
- Run generated scripts in Adobe Illustrator via File > Scripts > Other Script.
- All dimensions and coordinates are specified in millimeters.
- Use `fill: "none"` for shapes intended as CNC cut paths.
- The `text` shape type creates editable text; convert to outlines before CNC export using the companion export script.
- The `path` shape type accepts SVG-style path data for complex curves and contours.
- If `exportPath` is specified, the script includes an export step after creating the artwork.
