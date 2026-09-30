"use client";

import { Fragment } from "react";
import { Box, Typography } from "@mui/material";
import type { ResumeData } from "@/types/resume";
import { useEditableItem } from "@/hook/useInlineEditing";
import { EditableSection } from "../shared/EditableSection";
import {
  AddInline,
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

// Experience: a timeline table. Dates in a narrow left column, role and
// bullets on the right; long bullet lists flow into two columns on wide screens.
export const ShowcaseExperience = ({ resume }: { resume: ResumeData }) => {
  const palette = useShowcasePalette();
  const { field, isEditMode, onAddAction, onDeleteAction } = useEditableItem("experience");
  if (!resume.experience.length && !isEditMode) return null;

  return (
    <EditableSection sectionId="experience" component="section">
      <Box sx={containerSx}>
        <Box>
          <SectionHeading
            section="experience"
            fieldId="experienceTitle"
            text={resume.experienceTitle || "Experience"}
          />
        </Box>

        {resume.experience.map((job, index) => {
          const duration = field(`experience.${index}.duration`);
          const position = field(`experience.${index}.position`);
          const company = field(`experience.${index}.company`);
          const location = field(`experience.${index}.location`);

          return (
            <Box key={job.id}>
              <Box
                component="article"
                sx={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 3fr) minmax(0, 9fr)" },
                  gap: { xs: 1.5, md: 5 },
                  py: { xs: 4, md: 6 },
                  pr: onDeleteAction ? 6 : 0,
                  borderBottom: `1px solid ${palette.rule}`,
                }}
              >
                <DeleteButton
                  top={{ xs: 32, md: 50 }}
                  label={`Delete ${job.position} at ${job.company}`}
                  onDelete={onDeleteAction && (() => onDeleteAction(`experience.${index}`))}
                />
                <Typography
                  {...duration.props}
                  sx={withFieldSx(
                    {
                      fontFamily: "inherit",
                      color: palette.muted,
                      fontWeight: 550,
                      fontVariantNumeric: "tabular-nums",
                      pt: { md: 1 },
                      alignSelf: "start",
                    },
                    duration.sx,
                  )}
                >
                  {job.duration}
                </Typography>

                <Box>
                  <Typography
                    component="h3"
                    {...position.props}
                    sx={withFieldSx(
                      {
                        fontFamily: "inherit",
                        fontWeight: 750,
                        fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
                        lineHeight: 1.05,
                        letterSpacing: "-0.025em",
                        color: palette.ink,
                      },
                      position.sx,
                    )}
                  >
                    {job.position}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 1.5, mt: 1, mb: 3 }}>
                    <Typography
                      {...company.props}
                      sx={withFieldSx(
                        { fontFamily: "inherit", fontStyle: "italic", fontWeight: 550, color: palette.accent, fontSize: "1rem" },
                        company.sx,
                      )}
                    >
                      {job.company}
                    </Typography>
                    <Typography
                      {...location.props}
                      sx={withFieldSx(
                        { fontFamily: "inherit", color: palette.muted, fontSize: "1rem" },
                        location.sx,
                      )}
                    >
                      {job.location}
                    </Typography>
                  </Box>

                  <Box
                    component="ul"
                    sx={{
                      m: 0,
                      p: 0,
                      listStyle: "none",
                      columnCount: job.description.length > 5 ? { xs: 1, lg: 2 } : 1,
                      columnGap: 6,
                    }}
                  >
                    {job.description.map((bullet, bulletIndex) => {
                      const bulletField = field(`experience.${index}.description.${bulletIndex}`);
                      return (
                        <Box
                          component="li"
                          key={bulletIndex}
                          {...bulletField.props}
                          sx={withFieldSx(
                            {
                              breakInside: "avoid",
                              position: "relative",
                              pl: 2.5,
                              mb: 1.25,
                              color: palette.body,
                              lineHeight: 1.6,
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: "0.8em",
                                width: 8,
                                height: 2,
                                backgroundColor: palette.accent,
                              },
                            },
                            bulletField.sx,
                          )}
                        >
                          {bullet || "New bullet point"}
                        </Box>
                      );
                    })}
                  </Box>
                  {onAddAction && (
                    <AddInline
                      label="Add bullet point"
                      onAdd={(anchor) => onAddAction(`experience.${index}.bullet`, anchor)}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}

        <AddRow label="Add experience" onAdd={onAddAction && ((anchor) => onAddAction("experience", anchor))} />
      </Box>
    </EditableSection>
  );
};

// Skills: set as large flowing type, one paragraph per category, accent
// slashes between items. No proficiency bars.
export const ShowcaseSkills = ({ resume }: { resume: ResumeData }) => {
  const palette = useShowcasePalette();
  const { field, isEditMode, onAddAction, onDeleteAction } = useEditableItem("skills");
  if (!resume.skills.length && !isEditMode) return null;

  return (
    <EditableSection sectionId="skills" component="section">
      <Box sx={containerSx}>
        <Box>
          <SectionHeading section="skills" fieldId="skillsTitle" text={resume.skillsTitle || "Skills"} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 6, md: 8 } }}>
          {resume.skills.map((category, categoryIndex) => {
            const categoryField = field(`skills.${categoryIndex}.category`);
            return (
              <Box key={`${category.category}-${categoryIndex}`}>
                <Box sx={{ position: "relative", pr: onDeleteAction ? 6 : 0 }}>
                  <DeleteButton
                    top={-3}
                    label={`Delete skill category ${category.category}`}
                    onDelete={onDeleteAction && (() => onDeleteAction(`skills.${categoryIndex}`))}
                  />
                  <Typography
                    component="h3"
                    {...categoryField.props}
                    sx={withFieldSx(
                      {
                        fontFamily: "inherit",
                        fontStyle: "italic",
                        fontWeight: 550,
                        color: palette.muted,
                        fontSize: "1rem",
                        mb: 2,
                      },
                      categoryField.sx,
                    )}
                  >
                    {category.category}
                  </Typography>
                  <Box
                    component="ul"
                    sx={{
                      m: 0,
                      p: 0,
                      listStyle: "none",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      columnGap: { xs: 1.25, md: 2 },
                      rowGap: 0.5,
                      maxWidth: 1200,
                    }}
                  >
                    {category.items.map((skill, itemIndex) => {
                      const skillField = field(`skills.${categoryIndex}.${itemIndex}.name`);
                      return (
                        <Fragment key={`${skill.name}-${itemIndex}`}>
                          <Box
                            component="li"
                            {...skillField.props}
                            sx={withFieldSx(
                              {
                                fontWeight: 700,
                                fontSize: "clamp(1.375rem, 2.6vw, 2.25rem)",
                                lineHeight: 1.15,
                                letterSpacing: "-0.03em",
                                color: palette.ink,
                              },
                              skillField.sx,
                            )}
                          >
                            {skill.name || "New skill"}
                          </Box>
                          {itemIndex < category.items.length - 1 && (
                            <Box
                              component="li"
                              aria-hidden
                              sx={{
                                color: palette.accent,
                                fontWeight: 300,
                                fontSize: "clamp(1.375rem, 2.6vw, 2.25rem)",
                                lineHeight: 1.15,
                              }}
                            >
                              /
                            </Box>
                          )}
                        </Fragment>
                      );
                    })}
                    {onAddAction && (
                      <Box component="li" sx={{ alignSelf: "center", ml: 1 }}>
                        <AddInline
                          pill
                          label="skill"
                          onAdd={(anchor) => onAddAction(`skills.${categoryIndex}.item`, anchor)}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </EditableSection>
  );
};

// Services: ruled rows, title on the left and the offered skills on the right.
export const ShowcaseServices = ({ resume }: { resume: ResumeData }) => {
  const palette = useShowcasePalette();
  const { field, isEditMode, onAddAction, onDeleteAction } = useEditableItem("services");
  if (!resume.services.length && !isEditMode) return null;

  return (
    <EditableSection sectionId="services" component="section">
      <Box sx={{ ...containerSx, pt: { xs: 2, md: 4 } }}>
        <Box>
          <SectionHeading section="services" fieldId="servicesTitle" text={resume.servicesTitle || "Services"} />
        </Box>

        {resume.services.map((service, serviceIndex) => {
          const titleField = field(`services.${serviceIndex}.title`);
          const subtitleField = field(`services.${serviceIndex}.subtitle`);
          return (
            <Box key={service.id}>
              <Box
                sx={{
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 6fr) minmax(0, 6fr)" },
                  gap: { xs: 1.5, md: 5 },
                  py: { xs: 3.5, md: 4.5 },
                  pr: onDeleteAction ? 6 : 0,
                  borderBottom: `1px solid ${palette.rule}`,
                  alignItems: "baseline",
                }}
              >
                <DeleteButton
                  top={{ xs: 28, md: 38 }}
                  label={`Delete service ${service.title}`}
                  onDelete={onDeleteAction && (() => onDeleteAction(`services.${serviceIndex}`))}
                />
                <Box>
                  <Typography
                    component="h3"
                    {...titleField.props}
                    sx={withFieldSx(
                      {
                        fontFamily: "inherit",
                        fontWeight: 750,
                        fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
                        lineHeight: 1.05,
                        letterSpacing: "-0.025em",
                        color: palette.ink,
                      },
                      titleField.sx,
                    )}
                  >
                    {service.title}
                  </Typography>
                  {(service.subtitle || isEditMode) && (
                    <Typography
                      {...subtitleField.props}
                      sx={withFieldSx(
                        { fontFamily: "inherit", color: palette.muted, mt: 0.75 },
                        subtitleField.sx,
                      )}
                    >
                      {service.subtitle || "+ Add subtitle"}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 2.5, rowGap: 1 }}>
                  {service.items.map((item, itemIndex) => {
                    const itemField = field(`services.${serviceIndex}.${itemIndex}.name`);
                    return (
                      <Typography
                        key={item.id}
                        {...itemField.props}
                        sx={withFieldSx(
                          { fontFamily: "inherit", fontSize: "1.125rem", fontWeight: 550, color: palette.body },
                          itemField.sx,
                        )}
                      >
                        {item.name || "New item"}
                      </Typography>
                    );
                  })}
                  {onAddAction && (
                    <AddInline
                      pill
                      label="item"
                      onAdd={(anchor) => onAddAction(`services.${serviceIndex}.item`, anchor)}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}

        <AddRow label="Add service" onAdd={onAddAction && ((anchor) => onAddAction("services", anchor))} />
      </Box>
    </EditableSection>
  );
};

// Education and certifications: simple dated lists. Rendered together as a
// two-column split by default; `only` renders one full width (used when the
// saved section order separates them).
export const ShowcaseCredentials = ({
  resume,
  only,
  certificationsFirst,
}: {
  resume: ResumeData;
  only?: "education" | "certifications";
  /** Two-column mode: render certifications before education (matches the saved section order). */
  certificationsFirst?: boolean;
}) => {
  const palette = useShowcasePalette();
  const education = useEditableItem("education");
  const certifications = useEditableItem("certifications");
  const isEditMode = education.isEditMode;
  const showEducation = only !== "certifications" && (resume.education.length > 0 || isEditMode);
  const showCerts = only !== "education" && (resume.certifications.length > 0 || isEditMode);
  if (!showEducation && !showCerts) return null;

  const rowSx = {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 0.5,
    py: 3,
    pr: education.onDeleteAction || certifications.onDeleteAction ? 6 : 0,
    borderBottom: `1px solid ${palette.rule}`,
  } as const;
  const yearSx = { fontFamily: "inherit", color: palette.muted, fontVariantNumeric: "tabular-nums", fontWeight: 550 };
  const titleSx = {
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: "1.2rem",
    lineHeight: 1.2,
    letterSpacing: "-0.015em",
    color: palette.ink,
  };
  const subSx = { fontFamily: "inherit", color: palette.body };

  const educationBlock = showEducation && (
    <EditableSection sectionId="education" component="section">
      <Box>
        <SectionHeading section="education" fieldId="educationTitle" text={resume.educationTitle || "Education"} />
      </Box>
      {resume.education.map((item, index) => {
        const degree = education.field(`education.${index}.degree`);
        const school = education.field(`education.${index}.school`);
        const year = education.field(`education.${index}.year`);
        return (
          <Box key={item.id}>
            <Box sx={rowSx}>
              <DeleteButton
                top={20}
                label={`Delete ${item.degree} at ${item.school}`}
                onDelete={education.onDeleteAction && (() => education.onDeleteAction?.(`education.${index}`))}
              />
              <Typography {...year.props} sx={withFieldSx(yearSx, year.sx)}>
                {item.year}
              </Typography>
              <Typography component="h3" {...degree.props} sx={withFieldSx(titleSx, degree.sx)}>
                {[item.degree, item.field].filter(Boolean).join(", ")}
              </Typography>
              <Typography {...school.props} sx={withFieldSx(subSx, school.sx)}>
                {item.school}
              </Typography>
            </Box>
          </Box>
        );
      })}
      <AddRow
        label="Add education"
        onAdd={education.onAddAction && ((anchor) => education.onAddAction?.("education", anchor))}
      />
    </EditableSection>
  );

  const certificationsBlock = showCerts && (
    <EditableSection sectionId="certifications" component="section">
      <Box>
        <SectionHeading
          section="certifications"
          fieldId="certificationsTitle"
          text={resume.certificationsTitle || "Certifications"}
        />
      </Box>
      {resume.certifications.map((item, index) => {
        const name = certifications.field(`certifications.${index}.name`);
        const issuer = certifications.field(`certifications.${index}.issuer`);
        const year = certifications.field(`certifications.${index}.year`);
        return (
          <Box key={item.id}>
            <Box sx={rowSx}>
              <DeleteButton
                top={20}
                label={`Delete certification ${item.name}`}
                onDelete={
                  certifications.onDeleteAction &&
                  (() => certifications.onDeleteAction?.(`certifications.${index}`))
                }
              />
              <Typography {...year.props} sx={withFieldSx(yearSx, year.sx)}>
                {item.year}
              </Typography>
              <Typography component="h3" {...name.props} sx={withFieldSx(titleSx, name.sx)}>
                {item.name}
              </Typography>
              <Typography {...issuer.props} sx={withFieldSx(subSx, issuer.sx)}>
                {item.issuer}
              </Typography>
            </Box>
          </Box>
        );
      })}
      <AddRow
        label="Add certification"
        onAdd={
          certifications.onAddAction &&
          ((anchor) => certifications.onAddAction?.("certifications", anchor))
        }
      />
    </EditableSection>
  );

  return (
    <Box
      sx={{
        ...containerSx,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: showEducation && showCerts ? "repeat(2, minmax(0, 1fr))" : "1fr" },
        gap: { xs: 10, md: 8 },
      }}
    >
      {certificationsFirst ? certificationsBlock : educationBlock}
      {certificationsFirst ? educationBlock : certificationsBlock}
    </Box>
  );
};
