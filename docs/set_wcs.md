# set_wcs

**Category:** Control
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Switches the active work coordinate system by sending the specified G-code (G54-G59) directly to the machine. This changes which set of work offsets the machine uses for interpreting work coordinates.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| wcs | string | Yes | - | Work coordinate system to activate: G54, G55, G56, G57, G58, or G59 |

## Returns
Confirmation that the work coordinate system has been switched.

## Usage Notes
- Sends the WCS G-code (e.g., G54) directly to the machine.
- G54 is the default work coordinate system on most machines.
- Each WCS (G54-G59) maintains its own set of axis offsets.
- Useful for multi-fixture setups or multiple-part operations.
