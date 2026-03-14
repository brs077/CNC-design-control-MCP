# pause_job

**Category:** Control
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Pauses the currently running G-code job by issuing a feed hold and pausing the CNCjs sender. The machine decelerates to a controlled stop while maintaining its position. The job can be resumed with `resume_job`.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| *(none)* | - | - | - | This tool takes no parameters |

## Returns
Confirmation that the job has been paused.

## Usage Notes
- Combines a feed hold with a sender pause for a complete job pause.
- The machine decelerates gracefully and maintains its current position.
- Use `resume_job` to continue execution from where it was paused.
- Use `stop_job` if you do not intend to resume.
