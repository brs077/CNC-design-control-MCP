# get_alarm_info

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the current alarm status including whether an alarm is active, the alarm code, a human-readable meaning, and a suggested resolution. Use this when the machine enters an alarm state to understand the cause and how to recover.

## Parameters

None.

## Returns

An alarm information object:

| Field | Type | Description |
|-------|------|-------------|
| `alarmActive` | boolean | Whether an alarm is currently active |
| `alarmCode` | number | GRBL alarm code (1-9), or `null` if no alarm |
| `meaning` | string | Human-readable description of the alarm |
| `resolution` | string | Suggested steps to resolve the alarm |

## Example Response

```json
{
  "alarmActive": true,
  "alarmCode": 1,
  "meaning": "Hard limit triggered. Machine position is likely lost due to a sudden and immediate halt.",
  "resolution": "Re-home the machine with $H. Check that the workpiece and tool are clear of limit switches."
}
```

## Usage Notes

- Requires an active serial port connection; returns an error if not connected
- Covers GRBL alarm codes 1 through 9
- When an alarm is active, most commands are locked out until the alarm is cleared
- Use `$X` (kill alarm lock) or `$H` (homing cycle) to clear an alarm, depending on the alarm type
- Common alarms include hard limit triggers (1), soft limit triggers (2), and abort during cycle (3)
- If `alarmActive` is `false`, the other fields indicate no alarm condition
