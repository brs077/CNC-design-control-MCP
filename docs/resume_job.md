# resume_job

**Category:** Control
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Resumes a previously paused G-code job. Execution continues from the point where it was paused, restoring the sender and clearing the feed hold state.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| *(none)* | - | - | - | This tool takes no parameters |

## Returns
Confirmation that the job has been resumed.

## Usage Notes
- Only effective after a job has been paused with `pause_job` or `feed_hold`.
- Execution resumes from the exact point where the job was paused.
- Verify machine state and surroundings before resuming after a pause.
