# list_macros

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns all macros configured in the CNCjs server. Macros are saved G-code snippets that can be executed on demand. Use this to discover available macros before running one or to inspect their contents.

## Parameters

None.

## Returns

An array of macro objects:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the macro |
| `name` | string | Human-readable name of the macro |
| `content` | string | G-code content of the macro |

## Example Response

```json
[
  {
    "id": "abc123",
    "name": "Probe Z Zero",
    "content": "G91\nG38.2 Z-20 F100\nG10 L20 P1 Z0\nG0 Z5\nG90"
  },
  {
    "id": "def456",
    "name": "Return to Home",
    "content": "G90\nG0 Z10\nG0 X0 Y0"
  }
]
```

## Usage Notes

- Macros are fetched from the CNCjs server, not from the GRBL controller
- This does not require an active serial port connection to list macros, but executing them does
- Macro content may contain CNCjs-specific variables and expressions (e.g., `[xpos]`, `[ypos]`)
- Use `run_macro` to execute a macro by its ID or name
