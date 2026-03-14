# convert_design_format

**Category:** Marketplace & Packaging
**Risk Level:** Low (writes files to disk)
**Requires CNCjs:** No

## Description

Converts design files between common CNC formats. Supports SVG-to-DXF, DXF-to-SVG, and G-code-to-SVG preview conversions. Useful for creating multi-format packages or generating visual previews of toolpaths.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `inputFile` | string | Yes | — | Path to the source file |
| `outputFormat` | string | Yes | — | Target format: `svg`, `dxf`, `gcode_preview` |
| `outputFile` | string | Yes | — | Path for the converted output file |

## Returns

| Field | Type | Description |
|-------|------|-------------|
| `inputFile` | string | Source file path |
| `outputFile` | string | Output file path |
| `inputFormat` | string | Detected input format |
| `outputFormat` | string | Target format used |

## Supported Conversions

| Input | Output | Description |
|-------|--------|-------------|
| SVG | DXF | Extracts paths, circles, rectangles, lines, and polylines from SVG and writes DXF R12 entities |
| DXF | SVG | Renders DXF LINE, CIRCLE, ARC, and LWPOLYLINE entities as SVG paths |
| G-code | SVG (`gcode_preview`) | Renders G0 (rapid) and G1 (feed) moves as a 2D toolpath preview |

## Example Call

```json
{
  "inputFile": "/designs/coaster.svg",
  "outputFormat": "dxf",
  "outputFile": "/designs/coaster.dxf"
}
```

## Example: G-code Preview

```json
{
  "inputFile": "/gcode/facing-op.gcode",
  "outputFormat": "gcode_preview",
  "outputFile": "/previews/facing-op-preview.svg"
}
```

The G-code preview renders:
- **Red dashed lines** — rapid moves (G0)
- **Blue solid lines** — feed moves (G1)
- Automatic viewport calculation from toolpath extents
- SVG viewBox scaled to fit the entire toolpath

## Usage Notes

- SVG-to-DXF conversion handles basic geometry (lines, circles, arcs, polylines) — complex SVG features like gradients, filters, or text are not converted
- DXF output uses R12 format for maximum compatibility with CAM software
- G-code preview is 2D only (X/Y plane projection) — Z depth is not visualized
- Use this with `package_design` to include multiple formats in a single package
- The G-code preview is useful for marketplace listings where buyers want to see the toolpath before purchasing
