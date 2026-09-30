"use client";

import { Box, Typography } from "@mui/material";
import { NorthEast as NorthEastIcon } from "@mui/icons-material";
import type { PortfolioItem, ProjectItem, ResumeData } from "@/types/resume";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import { useEditableItem } from "@/hook/useInlineEditing";
import { EditableSection } from "../shared/EditableSection";
import {
  AddInline,
  AddRow,
  DeleteButton,
  Reveal,
  SectionHeading,
  useShowcasePalette,
  withFieldSx,
} from "./primitives";
import { EASE_OUT, HOVER_ONLY, RADIUS } from "./tokens";

type Palette = ReturnType<typeof useShowcasePalette>;
type FieldFn = ReturnType<typeof useEditableItem>["field"];

const containerSx = {
  maxWidth: 1440,
  mx: "auto",
  px: { xs: 2, sm: 4, lg: 6 },
  py: { xs: 9, md: 14 },
} as const;

// Underlined text link with a north-east arrow; in edit mode it's a span that
// opens the link's field instead of navigating.
const ArrowLink = ({
  href,
  label,
  placeholder,
  fieldId,
  field,
  isEditMode,
  palette,
}: {
  href?: string;
  label: string;
  placeholder: string;
  fieldId: InlineEditableFieldId;
  field: FieldFn;
  isEditMode: boolean;
  palette: Palette;
}) => {
  if (!href && !isEditMode) return null;
  const linkField = field(fieldId);

  return (
    <Box
      component={isEditMode ? "span" : "a"}
      href={isEditMode ? undefined : href}
      target={isEditMode ? undefined : "_blank"}
      rel={isEditMode ? undefined : "noopener noreferrer"}
      {...linkField.props}
      sx={withFieldSx(
        {
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          fontWeight: 650,
          fontSize: "0.95rem",
          color: href ? palette.ink : palette.muted,
          fontStyle: href ? "normal" : "italic",
          textDecoration: "underline",
          textDecorationColor: palette.accent,
          textDecorationThickness: "1.5px",
          textUnderlineOffset: "5px",
          "& svg": { transition: `transform 200ms ${EASE_OUT}` },
          [HOVER_ONLY]: { "&:hover svg": { transform: "translate(2px, -2px)" } },
          "&:focus-visible": {
            outline: `2px solid ${palette.focus}`,
            outlineOffset: 3,
            borderRadius: "4px",
          },
        },
        linkField.sx,
      )}
    >
      {href ? label : placeholder}
      <NorthEastIcon sx={{ fontSize: "1rem" }} />
    </Box>
  );
};

// Technology tags; each tag is its own editable field, plus "+ tag" in edit mode.
const TechList = ({
  section,
  index,
  technologies,
  field,
  onAddAction,
  palette,
}: {
  section: "projects" | "portfolio";
  index: number;
  technologies: string[];
  field: FieldFn;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
  palette: Palette;
}) => {
  if (!technologies.length && !onAddAction) return null;

  const tagSx = {
    display: "inline-flex",
    px: 1.5,
    py: 0.5,
    borderRadius: RADIUS.pill,
    border: `1px solid ${palette.rule}`,
    fontSize: "0.85rem",
    fontWeight: 550,
    color: palette.body,
    lineHeight: 1.4,
  } as const;

  return (
    <Box component="ul" sx={{ display: "flex", flexWrap: "wrap", gap: 1, p: 0, m: 0, listStyle: "none" }}>
      {technologies.map((tech, techIndex) => {
        const techField = field(`${section}.${index}.technologies.${techIndex}` as InlineEditableFieldId);
        return (
          <Box component="li" key={`${tech}-${techIndex}`} {...techField.props} sx={withFieldSx(tagSx, techField.sx)}>
            {tech || "New tag"}
          </Box>
        );
      })}
      {onAddAction && (
        <Box component="li">
          <AddInline pill label="tag" onAdd={(anchor) => onAddAction(`${section}.${index}.tech`, anchor)} />
        </Box>
      )}
    </Box>
  );
};

// Screenshot frame. Reserves its aspect ratio so nothing shifts while loading.
const MediaFrame = ({
  src,
  alt,
  ratio,
  fieldId,
  field,
  isEditMode,
  palette,
}: {
  src?: string;
  alt: string;
  ratio: string;
  fieldId: InlineEditableFieldId;
  field: FieldFn;
  isEditMode: boolean;
  palette: Palette;
}) => {
  if (!src && !isEditMode) return null;
  const imageField = field(fieldId);

  return (
    <Box
      {...imageField.props}
      sx={withFieldSx(
        {
          position: "relative",
          aspectRatio: ratio,
          borderRadius: RADIUS.frame,
          overflow: "hidden",
          backgroundColor: palette.surface,
          outlineOffset: "4px !important",
        },
        imageField.sx,
      )}
    >
      {src ? (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          sx={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            transition: `transform 700ms ${EASE_OUT}`,
          }}
        />
      ) : (
        <Box sx={{ height: "100%", display: "grid", placeItems: "center", color: palette.muted, fontWeight: 600 }}>
          + Add screenshot
        </Box>
      )}
    </Box>
  );
};

const ProjectEntry = ({
  project,
  index,
  large,
  palette,
}: {
  project: ProjectItem;
  index: number;
  large: boolean;
  palette: Palette;
}) => {
  const { field, isEditMode, onAddAction, onDeleteAction } = useEditableItem("projects");
  const name = field(`projects.${index}.name`);
  const description = field(`projects.${index}.description`);

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        // Image zoom lives on the article so hovering the text also responds.
        [HOVER_ONLY]: { "&:hover img": { transform: "scale(1.03)" } },
      }}
    >
      <DeleteButton
        label={`Delete project ${project.name}`}
        outside
        onDelete={onDeleteAction && (() => onDeleteAction(`projects.${index}`))}
      />
      <MediaFrame
        src={project.image}
        alt={`Screenshot of ${project.name}`}
        ratio={large ? "2 / 1" : "16 / 10"}
        fieldId={`projects.${index}.image`}
        field={field}
        isEditMode={isEditMode}
        palette={palette}
      />

      <Box
        sx={{
          mt: { xs: 2.5, md: 3.5 },
          display: "grid",
          gridTemplateColumns: large ? { xs: "1fr", md: "minmax(0, 5fr) minmax(0, 6fr)" } : "1fr",
          gap: { xs: 2, md: large ? 8 : 2 },
        }}
      >
        <Typography
          component="h3"
          {...name.props}
          sx={withFieldSx(
            {
              fontFamily: "inherit",
              fontWeight: 750,
              fontSize: large ? "clamp(1.5rem, 2.8vw, 2.25rem)" : "clamp(1.25rem, 2vw, 1.75rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: palette.ink,
            },
            name.sx,
          )}
        >
          {project.name || "Untitled project"}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Typography
            {...description.props}
            sx={withFieldSx(
              {
                fontFamily: "inherit",
                fontSize: large ? "1.1rem" : "1rem",
                lineHeight: 1.6,
                color: palette.body,
                maxWidth: "62ch",
              },
              description.sx,
            )}
          >
            {project.description || (isEditMode ? "+ Add description" : "")}
          </Typography>
          <TechList
            section="projects"
            index={index}
            technologies={project.technologies ?? []}
            field={field}
            onAddAction={onAddAction}
            palette={palette}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <ArrowLink
              href={project.demoUrl}
              label="Live demo"
              placeholder="+ Add demo link"
              fieldId={`projects.${index}.demoUrl`}
              field={field}
              isEditMode={isEditMode}
              palette={palette}
            />
            <ArrowLink
              href={project.link}
              label="Source code"
              placeholder="+ Add code link"
              fieldId={`projects.${index}.link`}
              field={field}
              isEditMode={isEditMode}
              palette={palette}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Projects with screenshots lead; each keeps its original index for its field ids.
// Also drives the editor sidebar's Projects form so both list the same order.
export const orderProjectsForDisplay = (projects: ProjectItem[]) =>
  projects
    .map((project, index) => ({ project, index }))
    .sort((a, b) => Number(Boolean(b.project.image)) - Number(Boolean(a.project.image)));

export const ShowcaseProjects = ({ resume }: { resume: ResumeData }) => {
  const palette = useShowcasePalette();
  const { isEditMode, onAddAction } = useEditableItem("projects");
  if (!resume.projects.length && !isEditMode) return null;

  const ordered = orderProjectsForDisplay(resume.projects);
  const featured = ordered.slice(0, 2);
  const rest = ordered.slice(2);

  return (
    <EditableSection sectionId="projects" component="section">
      <Box sx={containerSx}>
        <SectionHeading section="projects" fieldId="projectsTitle" text={resume.projectsTitle || "Selected projects"} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 8, md: 12 } }}>
          {featured.map(({ project, index }) => (
            <Reveal key={project.id}>
              <ProjectEntry project={project} index={index} large palette={palette} />
            </Reveal>
          ))}
        </Box>

        {rest.length > 0 && (
          <Box
            sx={{
              mt: { xs: 8, md: 12 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              columnGap: { md: 5 },
              rowGap: { xs: 8, md: 10 },
            }}
          >
            {rest.map(({ project, index }, position) => (
              <Reveal key={project.id} delay={(position % 2) * 80}>
                <ProjectEntry project={project} index={index} large={false} palette={palette} />
              </Reveal>
            ))}
          </Box>
        )}

        <AddRow label="Add project" onAdd={onAddAction && ((anchor) => onAddAction("projects", anchor))} />
      </Box>
    </EditableSection>
  );
};

const PortfolioRow = ({ item, index, palette }: { item: PortfolioItem; index: number; palette: Palette }) => {
  const { field, isEditMode, onAddAction, onDeleteAction } = useEditableItem("portfolio");
  const title = field(`portfolio.${index}.name`);
  const category = field(`portfolio.${index}.category`);
  const description = field(`portfolio.${index}.longDescription`);

  return (
    <Box
      component="article"
      sx={{
        position: "relative",
        py: { xs: 4, md: 5 },
        borderBottom: `1px solid ${palette.rule}`,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 3fr) minmax(0, 5fr) minmax(0, 4fr)" },
        gap: { xs: 2.5, md: 5 },
        alignItems: "start",
        [HOVER_ONLY]: { "&:hover img": { transform: "scale(1.04)" } },
      }}
    >
      <DeleteButton
        label={`Delete portfolio item ${item.title}`}
        outside
        onDelete={onDeleteAction && (() => onDeleteAction(`portfolio.${index}`))}
      />
      <MediaFrame
        src={item.image}
        alt={`Preview of ${item.title}`}
        ratio="16 / 10"
        fieldId={`portfolio.${index}.image`}
        field={field}
        isEditMode={isEditMode}
        palette={palette}
      />

      <Box>
        <Typography
          {...category.props}
          sx={withFieldSx(
            { fontFamily: "inherit", fontStyle: "italic", color: palette.accent, fontWeight: 550, mb: 1 },
            category.sx,
          )}
        >
          {item.category || (isEditMode ? "+ Add category" : "")}
        </Typography>
        <Typography
          component="h3"
          {...title.props}
          sx={withFieldSx(
            {
              fontFamily: "inherit",
              fontWeight: 750,
              fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: palette.ink,
              mb: 1.5,
            },
            title.sx,
          )}
        >
          {item.title || "Untitled work"}
        </Typography>
        <Typography
          {...description.props}
          sx={withFieldSx(
            { fontFamily: "inherit", color: palette.body, lineHeight: 1.6, maxWidth: "60ch" },
            description.sx,
          )}
        >
          {item.longDescription || item.description}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {((item.results ?? []).length > 0 || onAddAction) && (
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 1 }}>
            {(item.results ?? []).map((result, resultIndex) => {
              const resultField = field(`portfolio.${index}.result.${resultIndex}`);
              return (
                <Box
                  component="li"
                  key={resultIndex}
                  {...resultField.props}
                  sx={withFieldSx(
                    { color: palette.ink, fontWeight: 550, pl: 2, position: "relative", "&::before": { content: '""', position: "absolute", left: 0, top: "0.7em", width: 6, height: 2, backgroundColor: palette.accent } },
                    resultField.sx,
                  )}
                >
                  {result || "New result"}
                </Box>
              );
            })}
            {onAddAction && (
              <Box component="li">
                <AddInline label="Add result" onAdd={(anchor) => onAddAction(`portfolio.${index}.result`, anchor)} />
              </Box>
            )}
          </Box>
        )}
        <TechList
          section="portfolio"
          index={index}
          technologies={item.technologies ?? []}
          field={field}
          onAddAction={onAddAction}
          palette={palette}
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          <ArrowLink
            href={item.demoUrl}
            label="Live demo"
            placeholder="+ Add demo link"
            fieldId={`portfolio.${index}.demoUrl`}
            field={field}
            isEditMode={isEditMode}
            palette={palette}
          />
          <ArrowLink
            href={item.githubUrl}
            label="Source code"
            placeholder="+ Add code link"
            fieldId={`portfolio.${index}.githubUrl`}
            field={field}
            isEditMode={isEditMode}
            palette={palette}
          />
        </Box>
      </Box>
    </Box>
  );
};

export const ShowcasePortfolio = ({ resume }: { resume: ResumeData }) => {
  const palette = useShowcasePalette();
  const { isEditMode, onAddAction } = useEditableItem("portfolio");
  if (!resume.portfolio.length && !isEditMode) return null;

  return (
    <EditableSection sectionId="portfolio" component="section">
      <Box sx={{ ...containerSx, pt: { xs: 2, md: 4 } }}>
        <SectionHeading section="portfolio" fieldId="portfolioTitle" text={resume.portfolioTitle || "Case studies"} />
        <Box>
          {resume.portfolio.map((item, index) => (
            <Reveal key={item.id}>
              <PortfolioRow item={item} index={index} palette={palette} />
            </Reveal>
          ))}
        </Box>
        <AddRow label="Add case study" onAdd={onAddAction && ((anchor) => onAddAction("portfolio", anchor))} />
      </Box>
    </EditableSection>
  );
};
