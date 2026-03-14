# stop_job

**Category:** Control
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Stops the currently running G-code job. Can perform either a graceful stop or a forced stop using a soft reset. A forced stop immediately halts all motion, while a graceful stop allows the machine to finish its current movement.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| force | boolean | No | false | If true, sends a soft reset to immediately halt motion; if false, stops gracefully |

## Returns
Confirmation that the job has been stopped.

## Usage Notes
- With `force=false` (default), the job stops gracefully after the current movement completes.
- With `force=true`, a soft reset (0x18) is sent to immediately halt all motion, which may trigger an Alarm state.
- After a forced stop, you may need to use `unlock_machine` to clear the alarm.
- The loaded G-code remains in the sender after stopping.
