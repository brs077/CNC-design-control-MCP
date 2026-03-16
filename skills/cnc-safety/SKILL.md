---
name: cnc-safety
description: Emergency stop, feed hold, and jog cancel for CNC safety. Use immediately when the user reports a problem, crash, or emergency, or when something looks wrong during machining.
---

# CNC Safety Controls

Critical safety tools for stopping machine motion. Use these immediately when needed — do not hesitate.

## Available MCP Tools

- `emergency_stop` — **EMERGENCY STOP** — Immediately halts ALL motion via GRBL soft reset (0x18). Machine enters Alarm state. Use for any dangerous situation.
- `feed_hold` — Controlled deceleration to stop. Safer than emergency stop for non-critical pauses. Job can be resumed.
- `jog_cancel` — Cancel active jog motion only.

## When to Use

| Situation | Tool | Effect |
|-----------|------|--------|
| Collision / danger / fire / breakage | `emergency_stop` | Instant halt, alarm state |
| Need to pause safely | `feed_hold` | Controlled decel, resumable |
| Wrong jog direction | `jog_cancel` | Stops jog only |

## After Emergency Stop

1. Machine is in Alarm state
2. Use `unlock_machine` ($X) to clear the alarm
3. Or use `home_machine` ($H) to re-home
4. Check machine position and workpiece before continuing

## Important

- Emergency stop is ALWAYS available when a port is connected
- Never delay calling emergency_stop if there is any danger
- Feed hold preserves position; emergency stop may lose position tracking
