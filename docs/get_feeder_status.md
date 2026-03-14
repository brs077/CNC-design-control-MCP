# get_feeder_status

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the status of the CNCjs command feeder, which manages the queue of G-code commands being sent to the controller. Use this to diagnose why commands may not be executing or to check if the feeder is paused.

## Parameters

None.

## Returns

A feeder status object:

| Field | Type | Description |
|-------|------|-------------|
| `hold` | boolean | Whether the feeder is currently held (paused) |
| `holdReason` | string\|null | Reason for the hold, or `null` if not held |
| `queue` | number | Number of commands waiting in the feeder queue |
| `pending` | boolean | Whether there is a command pending acknowledgment from the controller |

## Example Response

```json
{
  "hold": false,
  "holdReason": null,
  "queue": 0,
  "pending": false
}
```

## Usage Notes

- A held feeder means commands are queued but not being sent to the controller
- Common hold reasons include tool change requests, M0/M1 program pauses, and alarm conditions
- If `queue` is growing but commands are not executing, check `hold` and `holdReason`
- The `pending` field indicates whether the feeder is waiting for an `ok` response from GRBL
