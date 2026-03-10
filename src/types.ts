// GRBL state interfaces — mirrors CNCjs controller:state event structure

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface GrblStatus {
  activeState: string; // Idle, Run, Hold, Jog, Alarm, Door, Check, Home, Sleep
  mpos: Position; // Machine position
  wpos: Position; // Work position
  wco: Position; // Work coordinate offset
  ov: [number, number, number]; // Override values [feed%, rapid%, spindle%]
  buf: { planner: number; rx: number }; // Buffer counts
  feedrate: number; // Current feedrate
  spindle: number; // Current spindle RPM
}

export interface GrblParserState {
  modal: {
    motion: string; // G0, G1, G2, G3
    wcs: string; // G54-G59
    plane: string; // G17, G18, G19
    units: string; // G20 (inch), G21 (mm)
    distance: string; // G90 (absolute), G91 (incremental)
    feedrate: string; // G93 (inverse time), G94 (units/min)
    program: string; // M0, M1, M2, M30
    spindle: string; // M3 (CW), M4 (CCW), M5 (stop)
    coolant: string; // M7 (mist), M8 (flood), M9 (off)
  };
  tool: number;
  feedrate: number;
  spindle: number;
}

export interface GrblState {
  status: GrblStatus;
  parserstate: GrblParserState;
}

export interface SenderStatus {
  name: string; // loaded file name
  size: number; // total lines
  total: number; // total lines (alias)
  sent: number; // lines sent
  received: number; // lines acknowledged
  startTime: number; // ms timestamp
  finishTime: number;
  elapsedTime: number; // ms
  remainingTime: number; // ms
}

export interface FeederStatus {
  hold: boolean;
  holdReason: string | null;
  queue: number;
  pending: boolean;
}

export interface SerialPort {
  port: string;
  manufacturer?: string;
  inuse?: boolean;
}

export interface MacroRecord {
  id: string;
  name: string;
  content: string;
}

export interface MachineProfile {
  id: string;
  name: string;
  limits: {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    zmin: number;
    zmax: number;
  };
}

// GRBL $$ settings with human-readable labels
export const GRBL_SETTINGS_MAP: Record<string, string> = {
  "$0": "Step pulse time (µs)",
  "$1": "Step idle delay (ms)",
  "$2": "Step port invert mask",
  "$3": "Direction port invert mask",
  "$4": "Step enable invert (bool)",
  "$5": "Limit pins invert (bool)",
  "$6": "Probe pin invert (bool)",
  "$10": "Status report options mask",
  "$11": "Junction deviation (mm)",
  "$12": "Arc tolerance (mm)",
  "$13": "Report in inches (bool)",
  "$20": "Soft limits enable (bool)",
  "$21": "Hard limits enable (bool)",
  "$22": "Homing cycle enable (bool)",
  "$23": "Homing direction invert mask",
  "$24": "Homing locate feed rate (mm/min)",
  "$25": "Homing search seek rate (mm/min)",
  "$26": "Homing switch debounce (ms)",
  "$27": "Homing switch pull-off distance (mm)",
  "$30": "Max spindle speed (RPM)",
  "$31": "Min spindle speed (RPM)",
  "$32": "Laser mode enable (bool)",
  "$100": "X-axis steps/mm",
  "$101": "Y-axis steps/mm",
  "$102": "Z-axis steps/mm",
  "$110": "X-axis max rate (mm/min)",
  "$111": "Y-axis max rate (mm/min)",
  "$112": "Z-axis max rate (mm/min)",
  "$120": "X-axis acceleration (mm/sec²)",
  "$121": "Y-axis acceleration (mm/sec²)",
  "$122": "Z-axis acceleration (mm/sec²)",
  "$130": "X-axis max travel (mm)",
  "$131": "Y-axis max travel (mm)",
  "$132": "Z-axis max travel (mm)",
};

// GRBL alarm codes
export const GRBL_ALARMS: Record<number, string> = {
  1: "Hard limit triggered. Position lost — re-home required.",
  2: "G-code motion target exceeds machine travel (soft limit).",
  3: "Reset while in motion. Position may be lost — re-home recommended.",
  4: "Probe fail. Probe did not contact within search distance.",
  5: "Probe fail. Probe already triggered before cycle started.",
  6: "Homing fail. Cycle could not find limit switch within search distance.",
  7: "Homing fail. Could not find limit switch on pull-off move.",
  8: "Homing fail. Could not set machine position — check switch wiring.",
  9: "Homing fail. Search distance not enough to clear limit switch on pull-off.",
};

// GRBL error codes
export const GRBL_ERRORS: Record<number, string> = {
  1: "G-code word is missing a value",
  2: "Numeric value format is not valid or missing",
  3: "Grbl '$' system command was not recognized",
  4: "Negative value received for an expected positive value",
  5: "Homing cycle is not enabled via settings",
  6: "Minimum step pulse time must be greater than 3µs",
  7: "EEPROM read failed — Grbl settings restored to defaults",
  8: "Grbl '$' command cannot be used while in alarm/jog state",
  9: "G-code commands locked out during alarm or jog state",
  10: "Soft limits require homing to be enabled",
  11: "Max characters per line exceeded",
  12: "Grbl '$' setting value exceeds the maximum step rate supported",
  13: "Safety door detected as opened and door state initiated",
  14: "Build info or startup line exceeds EEPROM line length limit",
  15: "Jog target exceeds machine travel — command ignored",
  16: "Jog command with no '=' or contains prohibited G-code",
  17: "Laser mode requires PWM output",
  20: "Unsupported or invalid G-code command found in block",
  21: "More than one G-code command from same modal group found",
  22: "Feed rate has not yet been set or is undefined",
  23: "G-code command in block requires an integer value",
  24: "Two G-code commands that both require the use of the XYZ axis words were detected",
  25: "A G-code word was repeated in the block",
  26: "A G-code command implicitly or explicitly requires XYZ axis words",
  27: "N line number value is not within the valid range of 1-9,999,999",
  28: "A G-code command was sent, but is missing some required P or L value words",
  29: "Grbl supports six work coordinate systems (G54-G59)",
  30: "A G-code command was sent, but is missing some required P or L value words",
  31: "G-code command not supported in GRBL",
  32: "G-code command expected a positive integer",
  33: "Motion command target is invalid (e.g., arc with 0 radius)",
  34: "Arc G-code requires at least one in-plane axis word",
  35: "Motion command target is invalid (could not compute arc)",
  36: "G-code requires at least one in-plane offset word",
  37: "G43.1 dynamic tool length offset missing required axis word",
  38: "Tool number greater than max supported value",
};
