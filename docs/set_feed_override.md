# set_feed_override

**Category:** Control
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Adjusts the feed rate override as a percentage of the programmed feed rate. This allows real-time adjustment of cutting speed during machine operation without modifying the G-code program.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| value | number | Yes | - | Feed rate override percentage (10-200) |

## Returns
Confirmation that the feed rate override has been set to the specified value.

## Usage Notes
- Valid range is 10% to 200% of the programmed feed rate.
- 100% represents the original programmed feed rate.
- Changes take effect immediately during machine operation.
- Useful for fine-tuning cutting speed based on material response or sound.
