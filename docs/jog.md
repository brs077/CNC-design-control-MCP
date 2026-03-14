# jog

**Category:** Control
**Risk Level:** HIGH
**Requires CNCjs:** Yes

## Description
Jogs the machine incrementally along a specified axis by a given distance at the specified feed rate. Uses the GRBL jogging command ($J=G91) for controlled incremental movement. Includes a sanity check to prevent excessively large jog distances.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| axis | string | Yes | - | Axis to jog: X, Y, or Z |
| distance | number | Yes | - | Distance to jog in millimeters |
| feedrate | number | Yes | - | Feed rate in mm/min |

## Returns
Confirmation that the jog command has been sent.

## Usage Notes
- The machine must be in Idle or Jog state to accept jog commands.
- Maximum allowed jog distance is 1000mm as a sanity check.
- Sends a $J=G91 command for incremental jogging relative to the current position.
- Use `jog_cancel` to cancel a jog in progress.
- Positive and negative distance values control the direction of movement.
