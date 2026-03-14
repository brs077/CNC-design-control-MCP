# list_illustrator_scripts

**Category:** Adobe Illustrator Integration
**Risk Level:** None
**Requires CNCjs:** No

## Description
Lists Adobe Illustrator script files in a specified directory. Scans for ExtendScript (.jsx) and JavaScript (.js) files and returns metadata about each script found, making it easy to inventory and manage generated Illustrator automation scripts.

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
- Searches for `.jsx` and `.js` files in the specified directory.
- Useful for reviewing previously generated Illustrator scripts before running them.
- The returned metadata includes file size and modification time for easy identification of recent scripts.
