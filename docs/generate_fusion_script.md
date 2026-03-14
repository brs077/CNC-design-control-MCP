# generate_fusion_script

**Category:** Fusion 360 Integration
**Risk Level:** None
**Requires CNCjs:** No

## Description
Generates Fusion 360 Python API scripts for parametric modeling, CAM setup, and file export operations. The generated scripts can be executed directly within Fusion 360 through the Scripts and Add-Ins dialog. Unit conversions between mm and Fusion 360's internal cm units are handled automatically.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| operation | string | Yes | - | Operation type: `sketch_rectangle`, `sketch_circle`, `extrude`, `revolve`, `fillet`, `chamfer`, `export_stl`, `export_dxf`, `cam_setup`, or `custom` |
| params | object | Yes | - | Key-value record of operation-specific parameters (dimensions, positions, angles, file paths, etc.) |
| outputPath | string | Yes | - | Output file path for the generated script (must end in `.py`) |
| description | string | No | - | Human-readable description of what the script does |

## Returns
The file path of the generated Python script.

## Usage Notes
- Run generated scripts in Fusion 360 via the Scripts and Add-Ins dialog, accessible with Shift+S.
- Fusion 360 uses centimeters internally; the generated scripts automatically convert mm input values to cm.
- The `custom` operation type allows freeform Fusion 360 API code generation for operations not covered by the predefined types.
- The `cam_setup` operation generates scripts that configure CAM toolpaths within Fusion 360.
- Export operations (`export_stl`, `export_dxf`) generate scripts that save the active design to the specified format.
- Scripts are self-contained and include all necessary Fusion 360 API imports.
