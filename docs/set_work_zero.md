# set_work_zero

**Category:** Control
**Risk Level:** HIGH
**Requires CNCjs:** Yes

## Description
Zeros one or more selected axes at the current machine position within the specified work coordinate system. This sets the work offset so that the current position becomes the zero point for the selected axes using the G10 L20 command.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| axes | string[] | Yes | - | Array of axes to zero: X, Y, and/or Z (minimum 1) |
| wcs | string | No | "G54" | Work coordinate system to modify (G54-G59) |

## Returns
Confirmation that the specified axes have been zeroed in the selected work coordinate system.

## Usage Notes
- The machine must be in an Idle state to set work zero.
- Sends a G10 L20 P{n} command with the selected axes set to 0.
- At least one axis must be specified in the axes array.
- The WCS parameter maps to P1-P6 for G54-G59 respectively.
- Verify the current machine position before zeroing to avoid incorrect offsets.
