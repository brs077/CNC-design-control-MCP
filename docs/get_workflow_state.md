# get_workflow_state

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns the current workflow state and machine active state. Unlike most query tools, this works even without an active serial port connection, reporting "disconnected" when no port is connected. Use this for a quick check of what the machine is doing.

## Parameters

None.

## Returns

A workflow state object:

| Field | Type | Description |
|-------|------|-------------|
| `workflowState` | string | Current workflow: `idle`, `running`, or `paused` |
| `activeState` | string | Machine active state (e.g., `Idle`, `Run`, `Hold`) or `disconnected` if no serial port |

## Example Response

```json
{
  "workflowState": "idle",
  "activeState": "Idle"
}
```

## Usage Notes

- Works even without a serial port connection, unlike most other query tools
- When disconnected, `activeState` will be `"disconnected"` and `workflowState` will be `"idle"`
- Use this as a lightweight check before deciding whether to send commands or start a job
- The `workflowState` reflects CNCjs's job sender state, while `activeState` reflects GRBL's state
- A machine can be in `workflowState: "idle"` but `activeState: "Run"` if commands were sent manually
