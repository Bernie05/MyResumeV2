"use client";

import { Box, Typography } from "@mui/material";
import type { ResumeData, TestimonialItem } from "@/types/resume";
import { useEditableItem } from "@/hook/useInlineEditing";
import { EditableSection } from "../shared/EditableSection";
import {
  AddRow,
  DeleteButton,
  SectionHeading,
  useShowcasePalette,
  withFieldSx,
} from "./primitives";

const containerSx = {
  maxWidth: 1440,
  mx: "auto",
  px: { xs: 2, sm: 4, lg: 6 },
  py: { xs: 9, md: 14 },
} as const;

type Palette = ReturnType<typeof useShowcasePalette>;
type FieldFn = ReturnType<typeof useEditableItem>["field"];

const Quote = ({
  item,
  index,
  lead,
  field,
  onDeleteAction,
  palette,
}: {
  item: TestimonialItem;
  index: number;
  lead: boolean;
  field: FieldFn;
  onDeleteAction?: (action: string) => void;
  palette: Palette;
}) => {
  const quote = field(`testimonials.${index}.quote`);
  const author = field(`testimonials.${index}.authorName`);
  const role = field(`testimonials.${index}.authorRole`);
  const company = field(`testimonials.${index}.authorCompany`);

  return (
    <Box component="figure" sx={{ position: "relative", m: 0, pr: onDeleteAction ? 6 : 0 }}>
      <DeleteButton
        top={0}
        label={`Delete testimonial from ${item.authorName}`}
        onDelete={onDeleteAction && (() => onDeleteAction(`testimonials.${index}`))}
      />
      <Typography
        component="blockquote"
        {...quote.props}
        sx={withFieldSx(
          {
            m: 0,
            fontFamily: "inherit",
            fontStyle: "italic",
            fontWeight: lead ? 500 : 450,
            fontSize: lead ? "clamp(1.375rem, 2.4vw, 2rem)" : "clamp(1.05rem, 1.4vw, 1.2rem)",
            lineHeight: lead ? 1.2 : 1.45,
            letterSpacing: lead ? "-0.02em" : "-0.005em",
            color: palette.ink,
            maxWidth: lead ? "30ch" : "46ch",
            pb: "0.1em",
          },
          quote.sx,
        )}
      >
        “{item.quote}”
      </Typography>
      <Box component="figcaption" sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", columnGap: 1 }}>
        <Typography {...author.props} sx={withFieldSx({ fontFamily: "inherit", fontWeight: 700, color: palette.ink }, author.sx)}>
          {item.authorName}
        </Typography>
        <Typography {...role.props} sx={withFieldSx({ fontFamily: "inherit", color: palette.muted }, role.sx)}>
          {item.authorRole}
        </Typography>
        {item.authorCompany && (
          <Typography {...company.props} sx={withFieldSx({ fontFamily: "inherit", color: palette.muted }, company.sx)}>
            ({item.authorCompany})
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Testimonials: one lead pull quote, the rest smaller in two columns.
export const ShowcaseTestimonials = ({ resume }: { resume: ResumeData }) => {
  const palette = useShowcasePalette();
  const { field, isEditMode, onAddAction, onDeleteAction } = useEditableItem("testimonials");
  if (!resume.testimonials.length && !isEditMode) return null;

  const [lead, ...rest] = resume.testimonials;

  return (
    <EditableSection sectionId="testimonials" component="section">
      <Box sx={containerSx}>
        <Box>
          <SectionHeading
            section="testimonials"
            fieldId="testimonialsTitle"
            text={resume.testimonialsTitle || "Kind words"}
          />
        </Box>
        {lead && (
          <Box>
            <Quote item={lead} index={0} lead field={field} onDeleteAction={onDeleteAction} palette={palette} />
          </Box>
        )}
        {rest.length > 0 && (
          <Box
            sx={{
              mt: { xs: 7, md: 10 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: { xs: 6, md: 8 },
            }}
          >
            {rest.map((item, position) => (
              <Box key={item.id}>
                <Quote
                  item={item}
                  index={position + 1}
                  lead={false}
                  field={field}
                  onDeleteAction={onDeleteAction}
                  palette={palette}
                />
              </Box>
            ))}
          </Box>
        )}
        <AddRow label="Add testimonial" onAdd={onAddAction && ((anchor) => onAddAction("testimonials", anchor))} />
      </Box>
    </EditableSection>
  );
};

// Character references: a compact ruled table (stacked cards on mobile).
export const ShowcaseReferences = ({ resume }: { resume: ResumeData }) => {
  const palette = useShowcasePalette();
  const { field, isEditMode, onAddAction, onDeleteAction } = useEditableItem("characterReferences");
  if (!resume.characterReferences.length && !isEditMode) return null;

  return (
    <EditableSection sectionId="characterReferences" component="section">
      <Box sx={{ ...containerSx, pt: { xs: 2, md: 4 } }}>
        <Box>
          <SectionHeading
            section="characterReferences"
            fieldId="characterReferencesTitle"
            text={resume.characterReferencesTitle || "References"}
          />
        </Box>
        {resume.characterReferences.map((person, index) => {
          const name = field(`characterReferences.${index}.name`);
          const position = field(`characterReferences.${index}.position`);
          const company = field(`characterReferences.${index}.company`);
          const contact = field(`characterReferences.${index}.contactNo`);
          return (
            <Box key={person.id}>
              <Box
                sx={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 4fr) minmax(0, 5fr) minmax(0, 3fr)" },
                  gap: { xs: 0.5, md: 4 },
                  py: 3,
                  pr: onDeleteAction ? 6 : 0,
                  borderBottom: `1px solid ${palette.rule}`,
                  alignItems: "baseline",
                }}
              >
                <DeleteButton
                  top={20}
                  label={`Delete reference ${person.name}`}
                  onDelete={onDeleteAction && (() => onDeleteAction(`characterReferences.${index}`))}
                />
                <Typography
                  {...name.props}
                  sx={withFieldSx(
                    { fontFamily: "inherit", fontWeight: 700, fontSize: "1.125rem", color: palette.ink },
                    name.sx,
                  )}
                >
                  {person.name}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 1 }}>
                  <Typography {...position.props} sx={withFieldSx({ fontFamily: "inherit", color: palette.body }, position.sx)}>
                    {person.position},
                  </Typography>
                  <Typography
                    {...company.props}
                    sx={withFieldSx({ fontFamily: "inherit", fontStyle: "italic", color: palette.body }, company.sx)}
                  >
                    {person.company}
                  </Typography>
                </Box>
                <Typography
                  {...contact.props}
                  sx={withFieldSx(
                    { fontFamily: "inherit", color: palette.muted, fontVariantNumeric: "tabular-nums", textAlign: { md: "right" } },
                    contact.sx,
                  )}
                >
                  {person.contactNo}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <AddRow
          label="Add reference"
          onAdd={onAddAction && ((anchor) => onAddAction("characterReferences", anchor))}
        />
      </Box>
    </EditableSection>
  );
};
