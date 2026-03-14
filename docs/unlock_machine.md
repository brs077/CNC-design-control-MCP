# unlock_machine

**Category:** Control
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Sends the $X kill alarm lock command to clear the machine's alarm state. This allows the machine to resume normal operation after an alarm has been triggered by an emergency stop, homing failure, or other error condition.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| *(none)* | - | - | - | This tool takes no parameters |

## Returns
Confirmation that the alarm lock has been cleared.

## Usage Notes
- Use only after the cause of the alarm has been identified and resolved.
- Unlocking without resolving the underlying issue may lead to unexpected machine behavior.
- Commonly needed after an emergency stop or failed homing cycle.
- Does not reset the machine position; verify position after unlocking.
