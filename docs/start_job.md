# start_job

**Category:** Control
**Risk Level:** HIGH
**Requires CNCjs:** Yes

## Description
Starts executing the G-code program currently loaded in the CNCjs sender. The machine will begin running the full program from the beginning. Requires that G-code has been loaded and the machine is in an Idle state.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| *(none)* | - | - | - | This tool takes no parameters |

## Returns
Confirmation that the job has started executing.

## Usage Notes
- Requires G-code to be loaded first using `load_gcode`.
- The machine must be in an Idle state before starting a job.
- Use `pause_job` to pause execution and `stop_job` to stop it.
- Monitor progress with job status tools during execution.
