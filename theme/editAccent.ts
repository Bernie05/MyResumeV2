// Selection/hover accent for the editor's outlines. Each template root sets
// `--edit-accent` (see templates/index.tsx); content inside reads it here.
// Teal is the fallback when no template sets it (e.g. the popover portal).
export const EDIT_ACCENT_VAR = "--edit-accent";
const FALLBACK = "#14b8a6";

/** The accent at `pct` percent opacity (color-mix keeps it theme-driven). */
export const editAccent = (pct = 100) =>
  `color-mix(in srgb, var(${EDIT_ACCENT_VAR}, ${FALLBACK}) ${pct}%, transparent)`;
