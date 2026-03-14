# coolant_control

**Category:** Control
**Risk Level:** None
**Requires CNCjs:** Yes

## Description
Controls the coolant system by turning mist coolant, flood coolant, or turning all coolant off. Sends the appropriate M-code to the machine to activate or deactivate the coolant supply.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| action | string | Yes | - | Coolant action: "mist", "flood", or "off" |

## Returns
Confirmation that the coolant command has been sent.

## Usage Notes
- Sends M7 for mist coolant, M8 for flood coolant, and M9 for coolant off.
- Not all machines support both mist and flood coolant.
- Coolant is typically turned off automatically at program end (M2/M30).
