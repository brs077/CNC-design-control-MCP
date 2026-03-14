# get_machine_settings

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns all GRBL `$$` settings with their current values and human-readable descriptions. Use this to inspect machine configuration such as step pulse time, maximum feed rates, acceleration values, and travel limits.

## Parameters

None.

## Returns

An array of setting objects:

| Field | Type | Description |
|-------|------|-------------|
| `setting` | string | GRBL setting key (e.g., `$0`, `$100`) |
| `value` | string | Current value of the setting |
| `description` | string | Human-readable label explaining the setting |

## Example Response

```json
[
  { "setting": "$0", "value": "10", "description": "Step pulse time (microseconds)" },
  { "setting": "$1", "value": "25", "description": "Step idle delay (milliseconds)" },
  { "setting": "$100", "value": "800.000", "description": "X-axis steps per mm" },
  { "setting": "$110", "value": "1000.000", "description": "X-axis max rate (mm/min)" },
  { "setting": "$120", "value": "200.000", "description": "X-axis acceleration (mm/sec^2)" },
  { "setting": "$130", "value": "300.000", "description": "X-axis max travel (mm)" }
]
```

## Usage Notes

- Requires an active serial port connection; returns an error if not connected
- This is a read-only query; it does not modify any settings
- Common settings include steps/mm ($100-$102), max rates ($110-$112), acceleration ($120-$122), and max travel ($130-$132)
- Use this to verify machine configuration before running jobs, especially on a new or reconfigured machine
- Setting descriptions are provided for convenience and cover standard GRBL parameters
