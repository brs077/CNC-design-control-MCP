---
name: fusion360
description: Generate Fusion 360 Python API scripts for parametric 3D modeling and CAM. Use when the user wants to create 3D models, assemblies, or CAM toolpaths in Autodesk Fusion 360.
---

# Fusion 360 Integration

Generate Python scripts for the Fusion 360 API to create parametric 3D models and CAM operations.

## Available MCP Tools

- `generate_fusion_script` — Generate a Python script for Fusion 360's API. Supports:
  - 3D sketches, extrusions, revolutions, sweeps, lofts
  - Parametric dimensions and constraints
  - Multi-body modeling and assemblies
  - CAM setup with toolpaths (adaptive, pocket, contour, drilling)
  - Material assignment and appearance
- `list_fusion_scripts` — List previously generated Fusion 360 scripts with metadata

## Script Execution

Generated scripts run inside Fusion 360:
1. Open Fusion 360
2. Go to **Scripts and Add-Ins** > **Scripts** > **Run**
3. Select the generated `.py` file
4. The script creates the model/toolpath automatically

## Workflow

1. Discuss the 3D part requirements with the user
2. Generate the Fusion 360 script with appropriate geometry and parameters
3. User runs the script in Fusion 360
4. For CAM: configure tool library and post-processor in Fusion 360
5. Post-process to G-code and use `load_gcode` to send to the machine

## Tips

- Scripts use the Fusion 360 Python API (`adsk.core`, `adsk.fusion`)
- Include error handling and user feedback in generated scripts
- Use parametric dimensions so users can easily modify the design
