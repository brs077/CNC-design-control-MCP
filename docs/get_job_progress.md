# get_job_progress

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the progress of the currently running G-code job, including completion percentage, lines sent, elapsed time, and estimated remaining time. Use this to monitor a job in progress or to check how far along a cut is.

## Parameters

None.

## Returns

A job progress object:

| Field | Type | Description |
|-------|------|-------------|
| `fileName` | string | Name of the G-code file being run |
| `progress` | number | Completion percentage (0-100) |
| `linesSent` | number | Number of G-code lines sent to the controller |
| `linesTotal` | number | Total number of G-code lines in the job |
| `elapsedTime` | string | Time elapsed since job start (e.g., `"00:05:23"`) |
| `remainingTime` | string | Estimated time remaining (e.g., `"00:12:47"`) |
| `workflowState` | string | Current workflow state: `running` or `paused` |

## Example Response

```json
{
  "fileName": "engrave_logo.nc",
  "progress": 35.2,
  "linesSent": 438,
  "linesTotal": 1245,
  "elapsedTime": "00:05:23",
  "remainingTime": "00:12:47",
  "workflowState": "running"
}
```

## Usage Notes

- Returns an error if no job is currently running
- The `remainingTime` is an estimate based on lines sent and may not account for varying line execution times
- Use `get_workflow_state` if you only need to check whether a job is running, paused, or idle
- Progress is calculated as `linesSent / linesTotal * 100`
