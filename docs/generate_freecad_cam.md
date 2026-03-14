# generate_freecad_cam

**Category:** FreeCAD Integration
**Risk Level:** None
**Requires CNCjs:** No

## Description
Generates FreeCAD CAM Python scripts for automated toolpath generation from 3D models. Supports common CNC operations including profiling, pocketing, drilling, facing, adaptive clearing, and engraving. Scripts output G-code through configurable post-processors for various CNC controllers.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| inputFile | string | No | - | Path to input model file (`.fcstd`, `.step`, or `.stl`) |
| operations | array | Yes | - | Array of CAM operation objects (see operation types below) |
| postProcessor | string | No | grbl | Post-processor for G-code output: `grbl`, `linuxcnc`, `mach3`, or `generic` |
| gcodeOutput | string | Yes | - | Output file path for the generated G-code (`.nc`) |
| outputScript | string | Yes | - | Output file path for the generated Python script (`.py`) |

### Operation Types and Properties
| Type | Properties | Description |
|------|------------|-------------|
| profile | depth, stepDown, toolDiameter, feedrate, spindleSpeed, side | Profile cut along edges |
| pocket | depth, stepDown, toolDiameter, feedrate, spindleSpeed | Clear material from enclosed areas |
| drill | depth, stepDown, toolDiameter, feedrate, spindleSpeed | Drill holes at specified locations |
| face | depth, stepDown, toolDiameter, feedrate, spindleSpeed | Surface facing operation |
| adaptive | depth, stepDown, toolDiameter, feedrate, spindleSpeed | Adaptive clearing for roughing |
| engrave | depth, toolDiameter, feedrate, spindleSpeed | V-carve or engraving operation |

Common operation properties:
| Property | Type | Description |
|----------|------|-------------|
| depth | number | Total cut depth (mm) |
| stepDown | number | Depth per pass (mm) |
| toolDiameter | number | Cutting tool diameter (mm) |
| feedrate | number | Cutting feedrate (mm/min) |
| spindleSpeed | number | Spindle speed (RPM) |
| side | string | Cut side for profile operations: `inside`, `outside`, or `on` |

## Returns
The file path of the generated Python script.

## Usage Notes
- Run the generated script via: `freecadcmd script.py`
- The `inputFile` parameter is optional; if omitted, the script operates on the active FreeCAD document.
- The `postProcessor` determines the G-code dialect and formatting conventions for the target CNC controller.
- Operations are applied sequentially in the order they appear in the array.
- The `adaptive` operation type uses adaptive clearing algorithms for efficient roughing with reduced tool engagement.
- The `side` property on profile operations controls whether the tool cuts inside, outside, or directly on the profile edge.
- All dimensions are in millimeters.
