# generate_listing_description

**Category:** Marketplace & Packaging
**Risk Level:** None
**Requires CNCjs:** No

## Description

Generates an SEO-optimized listing description for selling CNC designs on marketplace platforms. Produces platform-specific formatted text with keywords, sections, and formatting conventions that match each platform's style.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | Yes | — | Design/product name |
| `description` | string | Yes | — | Detailed description of the design |
| `platform` | string | Yes | — | Target platform: `etsy`, `cults3d`, `gumroad` |
| `tags` | array | No | `[]` | Keywords/tags for SEO |
| `fileFormats` | array | No | `[]` | Included file formats (e.g., `["SVG", "DXF", "G-code"]`) |
| `dimensions` | string | No | — | Physical dimensions of the design |
| `material` | string | No | — | Recommended material (e.g., "3mm plywood", "6mm acrylic") |
| `tooling` | string | No | — | Recommended tooling (e.g., "1/8 inch single flute upcut") |

## Returns

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Optimized listing title |
| `description` | string | Full formatted listing description |
| `tags` | array | SEO-optimized tags for the platform |
| `platform` | string | Target platform |

## Example Call

```json
{
  "name": "Geometric Coaster Set",
  "description": "Set of 4 geometric coaster designs — hexagon, triangle, circle, and square patterns",
  "platform": "etsy",
  "tags": ["coaster", "CNC", "woodworking", "geometric"],
  "fileFormats": ["SVG", "DXF", "G-code"],
  "dimensions": "100mm x 100mm each",
  "material": "3mm plywood or bamboo"
}
```

## Platform Formatting

### Etsy
- Title optimized for Etsy search (140 char max)
- Description uses line breaks and sections (no markdown)
- Up to 13 tags, each max 20 characters
- Includes "What you'll receive" and "How to use" sections

### Cults3D
- Markdown-formatted description
- Technical specifications section
- Printer/machine settings section
- Tags optimized for 3D printing and CNC community

### Gumroad
- Rich text formatting
- Bullet-point feature list
- "What's included" section
- Call-to-action language

## Usage Notes

- Run this after `package_design` to generate listing text for your packaged design
- Tags are automatically deduplicated and optimized for each platform's search algorithm
- Include `fileFormats`, `dimensions`, and `material` for more detailed and useful listings
- The generated description includes all standard sections buyers expect on each platform
