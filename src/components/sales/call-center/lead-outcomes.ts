// Shared list of lead statuses / call outcomes and their display metadata.
// The status column on leads doubles as the "latest call outcome" — updating
// it via the agent UI logs the newest outcome for that lead.
//
// "new" is kept as the stored value for pending (not-yet-worked) data so that
// existing rows and the database default keep working.

export const LEAD_STATUSES = [
  "new",
  "vv",
  "48",
  "will",
  "sd",
  "parents",
  "lc",
  "nr",
  "ni",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Pending",
  vv: "VV",
  "48": "48",
  will: "Will",
  sd: "SD",
  parents: "Parents",
  lc: "LC",
  nr: "NR",
  ni: "NI",
};

// Tailwind badge classes for on-screen chips (mirrors the export colors).
export const STATUS_COLORS: Record<string, string> = {
  new: "bg-primary text-primary-foreground  ",
  vv: "bg-success text-success  ",
  "48": "bg-success text-primary-foreground  ",
  will: "bg-primary text-primary  ",
  sd: "bg-warning text-warning-foreground  ",
  parents: "bg-muted text-foreground  ",
  lc: "bg-primary text-primary-foreground  ",
  nr: "bg-destructive text-primary-foreground  ",
  ni: "bg-destructive text-primary-foreground  ",
};

// Solid ARGB hex fills used when styling exported Excel rows.
export const STATUS_EXCEL_FILLS: Record<string, string> = {
  new: "FF1E3A8A", // Pending — dark blue
  vv: "FFBBF7D0", // light green
  "48": "FF15803D", // dark green
  will: "FF7DD3FC", // sky blue
  sd: "FFFDE047", // yellow
  parents: "FFD1D5DB", // grey
  lc: "FF8B5CF6", // violet
  nr: "FFEF4444", // red
  ni: "FF7F1D1D", // dark red
};

// Font color to keep text readable on top of the fills above.
export const STATUS_EXCEL_FONT_COLORS: Record<string, string> = {
  new: "FFFFFFFF",
  vv: "FF14532D",
  "48": "FFFFFFFF",
  will: "FF0C4A6E",
  sd: "FF713F12",
  parents: "FF111827",
  lc: "FFFFFFFF",
  nr: "FFFFFFFF",
  ni: "FFFFFFFF",
};
