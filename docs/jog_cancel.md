# jog_cancel

**Category:** Safety
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Sends the 0x85 realtime character to cancel any in-progress jog movement. The machine decelerates to a controlled stop without triggering an alarm state. Harmless to call even if no jog is currently in progress.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| *(none)* | - | - | - | This tool takes no parameters |

## Returns
Confirmation that the jog cancel command has been sent.

## Usage Notes
- Performs a controlled deceleration without triggering an alarm state.
- Safe to call at any time; has no effect if the machine is not currently jogging.
- Only cancels jog movements; does not affect other types of motion.
