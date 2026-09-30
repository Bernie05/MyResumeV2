"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragOverEvent,
  type Modifier,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { ThemeProvider, type Theme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import { isSectionHideable } from "@/components/templates/shared/sectionVisibility";
import { FIRST_SECTION, LAST_SECTION, isSectionMovable } from "@/components/templates/shared/sectionOrder";
import DesignPicker from "./DesignPicker";
import type { TemplateId } from "@/components/templates";
import { withReadableLightText } from "@/components/component/CustomPopover";

export const SECTION_LABELS: Record<ResumeEditableSection, string> = {
  about: "About (hero)",
  services: "Services",
  experience: "Experience",
  portfolio: "Portfolio",
  projects: "Projects",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  testimonials: "Testimonials",
  characterReferences: "Character references",
  contact: "Contact",
  stats: "Stats",
};

// Sections whose content is edited only by clicking text in the preview.
const INLINE_ONLY: ResumeEditableSection[] = ["services", "contact"];

// Compact controls inside the sidebar (forms were written for a full-width panel)
const sidebarTheme = (outer: Theme): Theme => {
  const t = withReadableLightText(outer);
  return {
    ...t,
    components: {
      ...t.components,
      MuiTextField: { ...t.components?.MuiTextField, defaultProps: { size: "small" } },
      MuiButton: { ...t.components?.MuiButton, defaultProps: { size: "small" } },
      // Item cards inside forms: less padding, more room for the inputs
      MuiCardContent: {
        ...t.components?.MuiCardContent,
        styleOverrides: { root: { padding: 12, "&:last-child": { paddingBottom: 12 } } },
      },
    },
  };
};


type Section = ResumeEditableSection;

const restrictToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 });

interface RowProps {
  section: Section;
  selected: boolean;
  hidden: boolean;
  accent: string;
  isDarkMode: boolean;
  onSelect: (section: Section) => void;
  eye: ReactNode;
  /** Drag handle (movable rows) or a lock (pinned rows). */
  lead: ReactNode;
}

// One sections-list row: lead (handle/lock) + label button + eye toggle.
const RowContent = ({ section, selected, hidden, accent, onSelect, eye, lead }: RowProps) => (
  <>
    {lead}
    <Button
      color="inherit"
      onClick={() => onSelect(section)}
      aria-current={selected ? "true" : undefined}
      sx={{
        flex: 1,
        justifyContent: "flex-start",
        textTransform: "none",
        fontSize: "0.875rem",
        fontWeight: selected ? 700 : 500,
        py: 0.75,
        px: 1,
        opacity: hidden ? 0.6 : 1,
        backgroundColor: selected ? `color-mix(in srgb, ${accent} 14%, transparent)` : undefined,
        "&:hover": { backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)` },
      }}
    >
      {SECTION_LABELS[section]}
      {hidden && (
        <Typography component="span" sx={{ ml: 1, fontSize: "0.75rem", color: "text.secondary" }}>
          Hidden
        </Typography>
      )}
    </Button>
    {eye}
  </>
);

const rowSx = { display: "flex", alignItems: "center", borderRadius: 1.5 } as const;
const leadSlotSx = { width: 28, height: 28, display: "grid", placeItems: "center", flexShrink: 0, color: "text.secondary", fontSize: 16 } as const;

const PinnedRow = ({ pin, ...row }: Omit<RowProps, "lead"> & { pin: string }) => (
  <Box component="li" sx={rowSx}>
    <RowContent
      {...row}
      lead={
        <Box sx={leadSlotSx}>
          <LockOutlinedIcon fontSize="inherit" titleAccess={pin} />
        </Box>
      }
    />
  </Box>
);

const SortableRow = (row: Omit<RowProps, "lead">) => {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({ id: row.section });
  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition };
  return (
    <Box
      component="li"
      ref={setNodeRef}
      style={style}
      sx={{
        ...rowSx,
        position: "relative",
        zIndex: isDragging ? 2 : undefined,
        backgroundColor: isDragging ? (row.isDarkMode ? "#0b1220" : "#ffffff") : undefined,
        boxShadow: isDragging ? "0 8px 20px rgba(15, 23, 42, 0.22), 0 1px 3px rgba(15, 23, 42, 0.18)" : "none",
        outline: isDragging ? `2px solid ${row.accent}` : "none",
        outlineOffset: -1,
      }}
    >
      <RowContent
        {...row}
        lead={
          <IconButton
            ref={setActivatorNodeRef}
            size="small"
            aria-label={`Reorder ${SECTION_LABELS[row.section]}`}
            {...attributes}
            {...listeners}
            sx={{
              ...leadSlotSx,
              p: 0,
              cursor: isDragging ? "grabbing" : "grab",
              touchAction: "none",
              "&:hover": { color: "text.primary", backgroundColor: `color-mix(in srgb, ${row.accent} 14%, transparent)` },
              "&:active": { cursor: "grabbing", color: row.accent },
              "&:focus-visible": { outline: `2px solid ${row.accent}`, outlineOffset: 1 },
            }}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

interface EditorSidebarProps {
  /** Sections in their resolved render order (about first, contact last). */
  sections: readonly Section[];
  /** The section selected in the preview; highlighted in the list. */
  selected: Section | null;
  /** Show the selected section's form instead of the list. */
  showForm: boolean;
  hidden: readonly Section[];
  accent: string;
  isDarkMode: boolean;
  template: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
  onSelect: (section: Section) => void;
  onBack: () => void;
  onToggleHidden: (section: Section) => void;
  /** Called on every drag move with the full new order (the canvas follows live). */
  onReorder: (order: Section[]) => void;
  /** Called after a drop with the section that was moved. */
  onDropped: (section: Section) => void;
  /** The selected section's form (renderSectionEditor). */
  form: ReactNode;
}

const EditorSidebar = ({
  sections,
  selected,
  showForm,
  hidden,
  accent,
  isDarkMode,
  template,
  onTemplateChange,
  onSelect,
  onBack,
  onToggleHidden,
  onReorder,
  onDropped,
  form,
}: EditorSidebarProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // While dragging, the list keeps the order it had at drag start (dnd-kit needs
  // stable items) even though onReorder already moves the canvas live.
  const [dragStart, setDragStart] = useState<Section[] | null>(null);
  const moved = useRef(false);
  const movable = sections.filter(isSectionMovable);
  const items = dragStart ?? movable;
  const compose = (middle: Section[]) => [
    ...sections.filter((id) => id === FIRST_SECTION),
    ...middle,
    ...sections.filter((id) => id === LAST_SECTION),
  ];

  const move = ({ active, over }: DragOverEvent) => {
    if (!dragStart || !over) return;
    const from = dragStart.indexOf(active.id as Section);
    const to = dragStart.indexOf(over.id as Section);
    if (from === to && !moved.current) return;
    onReorder(compose(arrayMove(dragStart, from, to)));
    moved.current = true;
  };

  const name = (id: unknown) => SECTION_LABELS[id as Section];
  const position = (id: unknown) => `position ${items.indexOf(id as Section) + 1} of ${items.length}`;

  const eyeButton = (section: Section) => {
    const isHidden = hidden.includes(section);
    const label = SECTION_LABELS[section];
    const canHide = isSectionHideable(section);
    return (
      <IconButton
        size="small"
        disabled={!canHide}
        aria-pressed={isHidden}
        aria-label={
          !canHide
            ? `${label} can't be hidden`
            : isHidden
              ? `Show ${label} on the site`
              : `Hide ${label} from the site`
        }
        onClick={() => onToggleHidden(section)}
        sx={{ color: isHidden ? "text.secondary" : "text.primary" }}
      >
        {isHidden ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
      </IconButton>
    );
  };

  const rowProps = (section: Section) => ({
    section,
    selected: selected === section,
    hidden: hidden.includes(section),
    accent,
    isDarkMode,
    onSelect,
    eye: eyeButton(section),
  });

  return (
    <ThemeProvider theme={sidebarTheme}>
      <Box
        sx={{
          minHeight: "100%",
          p: 2,
          color: "text.primary",
          backgroundColor: isDarkMode ? "#0b1220" : "#ffffff",
        }}
      >
        {selected && showForm ? (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
              <IconButton size="small" aria-label="Back to sections" onClick={onBack} edge="start">
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography component="h2" sx={{ flex: 1, fontSize: "1rem", fontWeight: 600 }}>
                {SECTION_LABELS[selected]}
              </Typography>
              {eyeButton(selected)}
            </Box>
            {INLINE_ONLY.includes(selected) ? (
              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                Click any text in the preview to edit it.
              </Typography>
            ) : (
              form
            )}
          </Box>
        ) : (
          <>
            <DesignPicker value={template} onChange={onTemplateChange} />
            <Box component="nav" aria-label="Resume sections">
              <Typography
                component="h2"
                sx={{ fontSize: "0.875rem", fontWeight: 600, color: "text.secondary", mb: 1, px: 1 }}
              >
                Sections
              </Typography>
              <DndContext
                id="sections-dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                // Only the sidebar scrolls while dragging; the page must not move under the sticky list
                autoScroll={{ canScroll: (el) => el !== document.scrollingElement }}
                modifiers={[restrictToVerticalAxis]}
                accessibility={{
                  announcements: {
                    onDragStart: ({ active }) => `Picked up ${name(active.id)}, ${position(active.id)}.`,
                    onDragOver: ({ active, over }) =>
                      over ? `${name(active.id)} is over ${name(over.id)}, ${position(over.id)}.` : undefined,
                    onDragEnd: ({ active, over }) =>
                      `${name(active.id)} dropped${over ? ` at ${position(over.id)}` : ""}.`,
                    onDragCancel: ({ active }) => `Reordering ${name(active.id)} cancelled.`,
                  },
                }}
                onDragStart={() => {
                  moved.current = false;
                  setDragStart(movable);
                }}
                onDragOver={move}
                // The last onDragOver already applied the order, so the drop shows what was previewed
                onDragEnd={(event) => {
                  setDragStart(null);
                  onDropped(event.active.id as Section);
                }}
                onDragCancel={() => {
                  if (moved.current && dragStart) onReorder(compose(dragStart));
                  setDragStart(null);
                }}
              >
                <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 0.25 }}>
                  {sections.includes(FIRST_SECTION) && (
                    <PinnedRow {...rowProps(FIRST_SECTION)} pin="Always first" />
                  )}
                  <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {items.map((section) => (
                      <SortableRow key={section} {...rowProps(section)} />
                    ))}
                  </SortableContext>
                  {sections.includes(LAST_SECTION) && (
                    <PinnedRow {...rowProps(LAST_SECTION)} pin="Always last" />
                  )}
                </Box>
              </DndContext>
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default EditorSidebar;
