# emergency_stop

**Category:** Safety
**Risk Level:** HIGH
**Requires CNCjs:** Yes

## Description
Sends a GRBL soft reset (0x18) to immediately halt all machine motion. This is the most aggressive stop available and should only be used in dangerous or emergency situations. The machine will enter an Alarm state after execution.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| *(none)* | - | - | - | This tool takes no parameters |

## Returns
Confirmation that the emergency stop (soft reset) command has been sent.

## Usage Notes
- Immediately halts ALL machine motion without controlled deceleration.
- Puts the machine into an Alarm state that requires `unlock_machine` to clear.
- Always available regardless of machine state; no state validation is performed.
- Use only in dangerous situations; prefer `feed_hold` for controlled stops.
- After an emergency stop, verify the machine state and position before resuming operations.
