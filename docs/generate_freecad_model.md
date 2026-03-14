# generate_freecad_model

**Category:** FreeCAD Integration
**Risk Level:** None
**Requires CNCjs:** No

## Description
Generates FreeCAD Python scripts for headless 3D modeling operations. Supports creating primitive shapes, sketch-based features, boolean operations, and exporting to standard CAD formats. Scripts can be executed without a GUI using FreeCAD's command-line interface.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| operations | array | Yes | - | Array of modeling operation objects (see operation types below) |
| exportPath | string | Yes | - | Export file path (`.step`, `.stl`, or `.fcstd`) |
| outputScript | string | Yes | - | Output file path for the generated Python script (`.py`) |
| headless | boolean | No | true | Run without FreeCAD GUI |

### Operation Types and Properties
| Type | Properties | Description |
|------|------------|-------------|
| box | width, height, length, x, y, z | Create a box primitive |
| cylinder | radius, height, x, y, z | Create a cylinder primitive |
| sphere | radius, x, y, z | Create a sphere primitive |
| cone | radius1, radius2, height, x, y, z | Create a cone primitive |
| sketch_rect | width, height, x, y | Create a rectangular sketch |
| sketch_circle | radius, x, y | Create a circular sketch |
| sketch_polygon | sides, radius, x, y | Create a regular polygon sketch |
| extrude | height | Extrude the active sketch |
| pocket | depth | Pocket (cut into) the active sketch |
| revolve | angle, axis | Revolve the active sketch |
| fillet | radius, edges | Apply fillet to edges |
| chamfer | size, edges | Apply chamfer to edges |
| boolean_union | body1, body2 | Union of two bodies |
| boolean_cut | body1, body2 | Subtract body2 from body1 |
| boolean_intersect | body1, body2 | Intersection of two bodies |

Each operation also accepts positioning properties (x, y, z) where applicable.

## Returns
The file path of the generated Python script.

## Usage Notes
- Run the generated script via: `freecadcmd script.py`
- When `headless` is true (default), scripts run without launching the FreeCAD GUI.
- Operations are executed sequentially in the order they appear in the array.
- Boolean operations reference previously created bodies by name or index.
- Supported export formats: `.step` (STEP), `.stl` (mesh), `.fcstd` (native FreeCAD).
- All dimensions are in millimeters.
