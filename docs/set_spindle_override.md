# set_spindle_override

**Category:** Control
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Adjusts the spindle speed override as a percentage of the programmed spindle speed. This allows real-time adjustment of spindle RPM during machine operation without modifying the G-code program.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| value | number | Yes | - | Spindle speed override percentage (10-200) |

## Returns
Confirmation that the spindle speed override has been set to the specified value.

## Usage Notes
- Valid range is 10% to 200% of the programmed spindle speed.
- 100% represents the original programmed spindle speed.
- Changes take effect immediately during machine operation.
- Useful for optimizing spindle speed based on cutting conditions.
