# get_error_info

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the last GRBL error code along with a human-readable meaning. Use this to understand why a G-code command was rejected by the controller and what needs to be corrected.

## Parameters

None.

## Returns

An error information object:

| Field | Type | Description |
|-------|------|-------------|
| `errorCode` | number | GRBL error code (1-38), or `null` if no error |
| `meaning` | string | Human-readable description of the error |

## Example Response

```json
{
  "errorCode": 20,
  "meaning": "Unsupported or invalid G-code command found in block."
}
```

## Usage Notes

- Covers GRBL error codes 1 through 38
- Errors indicate that a specific G-code line was rejected, unlike alarms which halt the machine
- Common errors include invalid G-code (20), undefined feed rate (22), and travel exceeds limits (25)
- Check `get_console_output` to see which command triggered the error
- Errors do not lock out the machine; you can send corrected commands immediately
- If no error has occurred, `errorCode` will be `null`
