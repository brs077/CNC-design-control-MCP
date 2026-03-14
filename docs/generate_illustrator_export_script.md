# generate_illustrator_export_script

**Category:** Adobe Illustrator Integration
**Risk Level:** None
**Requires CNCjs:** No

## Description
Generates an Adobe Illustrator ExtendScript (.jsx) for batch exporting the active document to various formats. Supports critical pre-export processing such as converting text to outlines, which is essential for CNC workflows where fonts must be converted to cuttable vector paths.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| format | string | Yes | - | Export format: `svg`, `dxf`, `pdf`, or `eps` |
| outputPath | string | Yes | - | File path for the exported file |
| options | object | No | - | Export options (see below) |
| outputScript | string | Yes | - | Output file path for the generated ExtendScript (`.jsx`) |

### Options Object Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| outlineText | boolean | true | Convert all text to outlines before export |
| flattenLayers | boolean | false | Flatten all layers into a single layer before export |

## Returns
The file path of the generated ExtendScript file.

## Usage Notes
- Run generated scripts in Adobe Illustrator via File > Scripts > Other Script.
- Text-to-outlines conversion (`outlineText: true`) is critical for CNC workflows: it converts font-based text into vector paths that can be cut or engraved.
- When `outlineText` is enabled, all text in the document is permanently converted to paths; this operation is not reversible in the exported file.
- Layer flattening (`flattenLayers`) can resolve layer-related issues when importing into CAM software.
- DXF export is commonly used for direct import into CNC CAM applications.
- SVG export preserves vector fidelity for web-based toolpath generators.
