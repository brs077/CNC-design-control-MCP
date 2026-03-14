# feed_hold

**Category:** Safety
**Risk Level:** Low
**Requires CNCjs:** Yes

## Description
Sends the "!" realtime character to initiate a controlled deceleration and stop of all machine motion. This is a safer alternative to emergency stop as it brings the machine to a halt gracefully without triggering an alarm state.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| *(none)* | - | - | - | This tool takes no parameters |

## Returns
Confirmation that the feed hold command has been sent.

## Usage Notes
- Performs a controlled deceleration, which is safer than an emergency stop.
- Does not trigger an Alarm state; the machine remains in a known good position.
- Can resume operation afterward using `resume_job`.
- Preferred over `emergency_stop` for non-critical stopping situations.
