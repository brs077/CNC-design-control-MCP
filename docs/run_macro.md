# run_macro

**Category:** Management
**Risk Level:** HIGH
**Requires CNCjs:** Yes

## Description
Executes a CNCjs macro by its name or ID. The tool looks up the macro in the CNCjs configuration, displays its content for verification, and then runs it. If the specified macro is not found, it lists all available macros.

## Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| identifier | string | Yes | - | Name or ID of the macro to execute |

## Returns
The macro content that was executed, along with confirmation of execution.

## Usage Notes
- Macros can be referenced by either their name or their unique ID.
- The macro content is displayed before execution for transparency.
- If the macro is not found, a list of all available macros is returned to help identify the correct name or ID.
- Macros may contain arbitrary G-code and commands; review content before executing unfamiliar macros.
- Macro behavior depends on the current machine state and configuration.
