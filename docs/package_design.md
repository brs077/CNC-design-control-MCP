# package_design

**Category:** Marketplace & Packaging
**Risk Level:** Low (writes files to disk)
**Requires CNCjs:** No

## Description

Bundles design files into a marketplace-ready package for selling on platforms like Etsy, Cults3D, or Gumroad. Creates a zip archive containing multi-format design files, auto-generated preview images, a README, and listing metadata.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | Yes | — | Package name (used for folder and zip naming) |
| `description` | string | Yes | — | Brief description of the design |
| `files` | array | Yes | — | Array of file paths to include in the package |
| `outputDir` | string | Yes | — | Directory where the package will be created |
| `license` | string | No | `"personal"` | License type: `personal`, `commercial`, `extended`, `public_domain`, `creative_commons` |
| `tags` | array | No | `[]` | Keywords/tags for marketplace listing |
| `price` | number | No | — | Suggested price in USD |
| `platform` | string | No | — | Target platform: `etsy`, `cults3d`, `gumroad` |

## Returns

| Field | Type | Description |
|-------|------|-------------|
| `packageDir` | string | Path to the created package directory |
| `zipFile` | string | Path to the zip archive |
| `files` | array | List of all files included in the package |
| `previewGenerated` | boolean | Whether a preview image was auto-generated |

## Example Call

```json
{
  "name": "geometric-coaster-set",
  "description": "Set of 4 geometric coaster designs for CNC routing",
  "files": [
    "/designs/coaster-hex.svg",
    "/designs/coaster-hex.dxf",
    "/designs/coaster-hex.gcode"
  ],
  "outputDir": "/packages",
  "license": "commercial",
  "tags": ["coaster", "geometric", "CNC", "woodworking"],
  "price": 4.99,
  "platform": "etsy"
}
```

## Package Contents

The generated package includes:

- **Design files** — all source files in their original formats
- **Preview image** — auto-generated SVG preview from G-code toolpaths, DXF entities, or SVG source
- **README.md** — human-readable description with file list and usage instructions
- **README.txt** — plain text version for maximum compatibility
- **listing.json** — structured metadata for marketplace listing automation
- **ZIP archive** — everything bundled into a single downloadable file

## License Types

| License | Description |
|---------|-------------|
| `personal` | Personal/non-commercial use only |
| `commercial` | Commercial use allowed (sell products made from the design) |
| `extended` | Extended commercial (unlimited products, resale rights) |
| `public_domain` | No restrictions |
| `creative_commons` | CC BY-SA 4.0 |

## Usage Notes

- Preview images are automatically generated from G-code (toolpath visualization), DXF (entity rendering), or SVG files
- Include multiple file formats (SVG + DXF + G-code) to maximize buyer appeal
- Use `generate_listing_description` afterward to create platform-specific listing text
- The zip file is ready for direct upload to marketplace platforms
