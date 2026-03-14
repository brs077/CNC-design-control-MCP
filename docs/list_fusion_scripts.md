# list_fusion_scripts

**Category:** Fusion 360 Integration
**Risk Level:** None
**Requires CNCjs:** No

## Description
Lists Fusion 360 Python script files in a specified directory. Scans for `.py` files and returns metadata about each script found, making it easy to inventory and manage generated Fusion 360 automation scripts.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| directory | string | No | "." | Directory path to scan for script files |

## Returns
Array of objects, each containing:
| Field | Type | Description |
|-------|------|-------------|
| name | string | File name of the script |
| path | string | Full file path |
| size | number | File size in bytes |
| modified | string | Last modified timestamp |

## Usage Notes
- Searches for `.py` files in the specified directory (non-recursive by default).
- Useful for reviewing previously generated Fusion 360 scripts before running them.
- The returned metadata includes file size and modification time for easy identification of recent scripts.
