# home_machine

**Category:** Control
**Risk Level:** HIGH
**Requires CNCjs:** Yes

## Description
Sends the $H homing cycle command to the CNC machine. The machine will move all axes toward their homing switches to establish a known reference position. The machine must be equipped with homing switches for this command to work.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| *(none)* | - | - | - | This tool takes no parameters |

## Returns
Confirmation that the homing cycle command has been sent.

## Usage Notes
- The machine must have homing switches installed and configured.
- Cannot home while the machine is in a Run or Jog state.
- The machine will move toward the homing switches at the configured homing seek rate.
- After homing, the machine position is set to the configured homing pull-off position.
- If homing fails (e.g., switch not triggered), the machine will enter an Alarm state.
