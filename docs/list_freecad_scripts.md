# list_freecad_scripts

**Category:** FreeCAD Integration
**Risk Level:** None
**Requires CNCjs:** No

## Description
Lists FreeCAD-related files in a specified directory, scanning for both Python scripts and native FreeCAD documents. Returns metadata about each file found, making it easy to inventory generated scripts and models.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| directory | string | No | "." | Directory path to scan for files |

## Returns
Array of objects, each containing:
| Field | Type | Description |
|-------|------|-------------|
| name | string | File name |
| path | string | Full file path |
| size | number | File size in bytes |
| modified | string | Last modified timestamp |

## Usage Notes
- Searches for `.py` and `.fcstd` files in the specified directory.
- Useful for reviewing previously generated FreeCAD scripts and models before execution.
- The returned metadata includes file size and modification time for easy identification of recent files.
