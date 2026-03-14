# spindle_control

**Category:** Control
**Risk Level:** HIGH
**Requires CNCjs:** Yes

## Description
Controls the spindle by turning it on in a specified direction or turning it off. When turning the spindle on, a speed in RPM must be provided. Sends the appropriate M-code (M3, M4, or M5) to the machine.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| action | string | Yes | - | Spindle action: "cw" (clockwise), "ccw" (counter-clockwise), or "off" |
| speed | number | Conditional | - | Spindle speed in RPM; required when action is "cw" or "ccw" |

## Returns
Confirmation that the spindle command has been sent.

## Usage Notes
- Sends M3 for clockwise, M4 for counter-clockwise, and M5 for off.
- Speed parameter is required when turning the spindle on (cw or ccw) and ignored when turning off.
- Ensure the spindle area is clear before turning on.
- The spindle may take a moment to reach the commanded speed.
