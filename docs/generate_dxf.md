# generate_dxf

**Category:** Design File Generation
**Risk Level:** None
**Requires CNCjs:** No

## Description
Generates DXF R12 format files from an array of geometric entities. DXF R12 is a universally supported format compatible with virtually all CAD and CAM software. All dimensions are specified in millimeters.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| entities | array | Yes | - | Array of entity objects defining the DXF geometry (see entity types below) |
| outputPath | string | Yes | - | File path for the generated DXF file |

### Entity Object Properties
| Property | Type | Applies To | Description |
|----------|------|------------|-------------|
| type | string | All | Entity type: `line`, `circle`, `arc`, or `polyline` |
| x1 | number | line | Line start X coordinate |
| y1 | number | line | Line start Y coordinate |
| x2 | number | line | Line end X coordinate |
| y2 | number | line | Line end Y coordinate |
| cx | number | circle, arc | Center X coordinate |
| cy | number | circle, arc | Center Y coordinate |
| radius | number | circle, arc | Radius |
| startAngle | number | arc | Start angle in degrees |
| endAngle | number | arc | End angle in degrees |
| points | array | polyline | Array of [x, y] coordinate pairs |
| closed | boolean | polyline | Whether to close the polyline (connect last point to first) |

## Returns
The file path of the generated DXF file.

## Usage Notes
- DXF R12 format is chosen for maximum compatibility across all CAD/CAM platforms.
- All dimensions are in millimeters.
- Arcs are defined with angles in degrees, measured counterclockwise from the positive X axis.
- Polylines can be open or closed; set `closed: true` to automatically connect the last point back to the first.
- The output file can be directly imported into Fusion 360, AutoCAD, FreeCAD, Carveco, and other CAD software.
