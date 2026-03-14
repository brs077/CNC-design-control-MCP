# get_console_output

**Category:** Query (Read-Only)
**Risk Level:** None
**Requires CNCjs:** Yes

## Description

Returns recent serial I/O from a ring buffer, showing both incoming GRBL responses and outgoing commands. Use this for debugging communication issues, verifying that commands were sent and acknowledged, or reviewing recent machine interactions.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lines` | number | No | 50 | Number of lines to return (1-200) |

## Returns

An array of console output strings, with outgoing commands prefixed by `>`:

| Field | Type | Description |
|-------|------|-------------|
| (array items) | string | Console lines; outgoing commands start with `>`, incoming responses are plain text |

## Example Response

```json
[
  "> G0 X10 Y10",
  "ok",
  "> G1 X50 Y50 F1000",
  "ok",
  "> ?",
  "<Idle|MPos:-100.000,-50.000,-5.000|FS:0,0|WCO:-100.000,-50.000,0.000>"
]
```

## Usage Notes

- Output comes from a ring buffer, so only the most recent lines are available
- Lines prefixed with `>` are commands that were sent to the controller
- Lines without a prefix are responses received from the controller
- Useful for diagnosing failed commands by checking if GRBL returned `error:` responses
- The `lines` parameter controls how many recent entries to retrieve (maximum 200)
- The buffer may contain interleaved status queries (`?`) and their responses
