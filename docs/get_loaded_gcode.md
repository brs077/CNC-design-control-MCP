# get_loaded_gcode

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the currently loaded G-code file name, total line count, and content. If the file is large, the content is truncated to the first 500 lines. Use this to inspect what G-code is queued up in CNCjs before running a job.

## Parameters

None.

## Returns

A G-code file object:

| Field | Type | Description |
|-------|------|-------------|
| `fileName` | string | Name of the loaded G-code file |
| `lineCount` | number | Total number of lines in the file |
| `content` | string | G-code content (truncated to 500 lines if the file is larger) |

## Example Response

```json
{
  "fileName": "engrave_logo.nc",
  "lineCount": 1250,
  "content": "G21\nG90\nG0 Z5.000\nG0 X0.000 Y0.000\n..."
}
```

## Usage Notes

- Returns an error if no G-code file is currently loaded in CNCjs
- Content is truncated to 500 lines for large files to avoid excessive response sizes
- Use `analyze_gcode` for detailed analysis of the loaded file without reading raw content
- The file must be loaded through CNCjs (via its UI or API) before this tool can access it
