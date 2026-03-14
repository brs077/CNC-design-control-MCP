# probe_z

**Category:** Control
**Risk Level:** HIGH
**Requires CNCjs:** Yes

## Description
Performs a Z-axis probe operation using a touch plate. The machine moves the Z-axis downward until the probe triggers, then optionally sets the Z-axis zero accounting for the touch plate thickness. Uses the G38.2 probing command and waits for the [PRB:] result.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| touchPlateThickness | number | Yes | - | Thickness of the touch plate in millimeters |
| feedrate | number | No | 100 | Probing feed rate in mm/min |
| maxDistance | number | No | 50 | Maximum distance to probe downward in mm |
| retract | number | No | 2 | Distance to retract after probe contact in mm |
| setZero | boolean | No | true | Whether to set Z zero after probing |

## Returns
The probe result including the contact position, and confirmation of Z zero if setZero is enabled.

## Usage Notes
- Sends a G38.2 probing command and waits for the [PRB:] response.
- When setZero is true, sets Z zero using G10 L20 accounting for the touch plate thickness.
- Ensure the touch plate is properly connected and positioned before probing.
- The probe will stop and report an error if maxDistance is reached without contact.
- The retract distance moves the tool up after contact to clear the touch plate.
