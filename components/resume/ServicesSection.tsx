"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  Code as CodeIcon,
  Palette as PaletteIcon,
  ElectricBolt as ZapIcon,
  Group as UsersIcon,
  PhoneIphone as SmartphoneIcon,
  Storage as DatabaseIcon,
  Source as GitIcon,
  Work as BriefcaseIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Build as BuildIcon,
  Devices as DevicesIcon,
  Analytics as AnalyticsIcon,
  Api as ApiIcon,
  Terminal as TerminalIcon,
  Brush as BrushIcon,
  DesignServices as DesignServicesIcon,
  Language as LanguageIcon,
  Dns as DnsIcon,
} from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";

interface SkillItem {
  name: string;
  proficiency: number;
  icon?: string;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
  icon?: string;
  subtitle?: string;
}

export const ICON_MAP: Record<string, React.ElementType> = {
  code: CodeIcon,
  palette: PaletteIcon,
  zap: ZapIcon,
  users: UsersIcon,
  smartphone: SmartphoneIcon,
  database: DatabaseIcon,
  git: GitIcon,
  briefcase: BriefcaseIcon,
  cloud: CloudIcon,
  security: SecurityIcon,
  speed: SpeedIcon,
  build: BuildIcon,
  devices: DevicesIcon,
  analytics: AnalyticsIcon,
  api: ApiIcon,
  terminal: TerminalIcon,
  brush: BrushIcon,
  design: DesignServicesIcon,
  language: LanguageIcon,
  dns: DnsIcon,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

const SKILL_ICONS: Record<string, React.ElementType> = {
  react: CodeIcon,
  typescript: CodeIcon,
  nodejs: BriefcaseIcon,
  frontend: PaletteIcon,
  backend: DatabaseIcon,
  performance: ZapIcon,
  leadership: UsersIcon,
  mobile: SmartphoneIcon,
  git: GitIcon,
  default: CodeIcon,
};

const getIconForSkill = (
  skillName: string,
  iconKey?: string,
): React.ElementType => {
  if (iconKey && ICON_MAP[iconKey]) {
    return ICON_MAP[iconKey];
  }
  const name = skillName.toLowerCase();
  for (const [key, icon] of Object.entries(SKILL_ICONS)) {
    if (name.includes(key)) return icon;
  }

  return SKILL_ICONS.default;
};

const getCategoryIcon = (
  category: string,
  iconKey?: string,
): React.ElementType => {
  if (iconKey && ICON_MAP[iconKey]) {
    return ICON_MAP[iconKey];
  }
  const name = category.toLowerCase();
  if (name.includes("backend")) return DatabaseIcon;
  if (name.includes("frontend")) return PaletteIcon;
  if (name.includes("tool") || name.includes("design")) return BrushIcon;
  if (name.includes("cloud") || name.includes("devops")) return CloudIcon;
  if (name.includes("mobile")) return SmartphoneIcon;
  return CodeIcon;
};

const ServicesSection = ({
  skills,
  servicesTitle,
  servicesSubtitle,
  onInlineFieldClick,
  activeInlineFieldId,
  onAddAction,
}: {
  skills: SkillCategory[];
  servicesTitle?: string;
  servicesSubtitle?: string;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: string,
    anchor?: HTMLElement,
  ) => void;
  activeInlineFieldId?: string | null;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
}) => {
  const { isDarkMode } = useThemeContext();
  const {
    primaryAccent,
    accentText,
    titleColor,
    mutedColor,
    bodyColor,
    sectionBackground,
    surfaceBackground,
    softBackground,
    outline,
    buttonGradient,
    hoverShadow,
  } = getSectionPalette(isDarkMode);

  const getInlineFieldSx = (fieldId: string) => ({
    borderRadius: 1,
    outline:
      activeInlineFieldId === fieldId
        ? "2px solid rgba(20, 184, 166, 0.9)"
        : "2px solid transparent",
    outlineOffset: 2,
    cursor: onInlineFieldClick ? "pointer" : "inherit",
    transition: "outline-color 160ms ease, box-shadow 160ms ease",
    "&:hover": onInlineFieldClick
      ? {
          outlineColor: "rgba(20, 184, 166, 0.55)",
          boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
        }
      : undefined,
  });

  const createInlineFieldProps = (fieldId: string) => {
    if (!onInlineFieldClick) {
      return {};
    }

    return {
      onClick: (event: React.MouseEvent) => {
        event.stopPropagation();
        onInlineFieldClick(
          "services",
          fieldId,
          event.currentTarget as HTMLElement,
        );
      },
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          onInlineFieldClick(
            "services",
            fieldId,
            event.currentTarget as HTMLElement,
          );
        }
      },
      role: "button",
      tabIndex: 0,
      "aria-label": `Edit ${fieldId}`,
    };
  };

  return (
    <Box
      sx={{
        mb: 8,
        p: { xs: 3, md: 4.5 },
        borderRadius: { xs: 4, md: 5 },
        background: sectionBackground,
        border: `1px solid ${outline}`,
      }}
    >
      {/* Section Header */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.75,
            py: 0.75,
            borderRadius: 999,
            background: buttonGradient,
            color: accentText,
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            mb: 2,
          }}
        >
          Services
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: titleColor,
            mb: 2,
            ...getInlineFieldSx("servicesTitle"),
          }}
          {...createInlineFieldProps("servicesTitle")}
        >
          {servicesTitle || "What I Offer"}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.125rem",
            color: mutedColor,
            fontWeight: 400,
            ...getInlineFieldSx("servicesSubtitle"),
          }}
          {...createInlineFieldProps("servicesSubtitle")}
        >
          {servicesSubtitle ||
            "Professional services tailored to your project needs"}
        </Typography>
      </Box>

      {/* Services Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        {skills.map((category, categoryIndex) => (
          <Card
            key={`${category.category}-${categoryIndex}`}
            sx={{
              background: surfaceBackground,
              border: `1px solid ${outline}`,
              borderRadius: "1rem",
              transition: "all 0.3s ease",
              height: "100%",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: hoverShadow,
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header with Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: softBackground,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...getInlineFieldSx(`skills.${categoryIndex}.icon`),
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                  }}
                  {...createInlineFieldProps(`skills.${categoryIndex}.icon`)}
                >
                  {React.createElement(
                    getCategoryIcon(category.category, category.icon),
                    {
                      sx: {
                        fontSize: "1.75rem",
                        color: primaryAccent,
                      },
                    },
                  )}
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: titleColor,
                      ...getInlineFieldSx(`skills.${categoryIndex}.category`),
                    }}
                    {...createInlineFieldProps(
                      `skills.${categoryIndex}.category`,
                    )}
                  >
                    {category.category} Development
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.875rem",
                      color: mutedColor,
                      display: "block",
                      mt: 0.5,
                      ...getInlineFieldSx(`skills.${categoryIndex}.subtitle`),
                    }}
                    {...createInlineFieldProps(
                      `skills.${categoryIndex}.subtitle`,
                    )}
                  >
                    {category.subtitle ||
                      `Expert ${category.category.toLowerCase()} solutions`}
                  </Typography>
                </Box>
              </Box>

              {/* Skills List */}
              <List sx={{ p: 0, m: 0 }}>
                {category.items.slice(0, 4).map((skill, itemIndex) => {
                  const IconComponent = getIconForSkill(skill.name, skill.icon);
                  return (
                    <ListItem
                      key={`${skill.name}-${itemIndex}`}
                      sx={{
                        p: 0,
                        mb: 2,
                        alignItems: "center",
                        "&:last-child": { mb: 0 },
                        ...getInlineFieldSx(
                          `skills.${categoryIndex}.${itemIndex}.name`,
                        ),
                      }}
                      {...createInlineFieldProps(
                        `skills.${categoryIndex}.${itemIndex}.name`,
                      )}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "32px",
                          color: primaryAccent,
                          ...getInlineFieldSx(
                            `skills.${categoryIndex}.${itemIndex}.icon`,
                          ),
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const props = createInlineFieldProps(
                            `skills.${categoryIndex}.${itemIndex}.icon`,
                          );
                          if (props.onClick) props.onClick(e as any);
                        }}
                      >
                        <IconComponent sx={{ fontSize: "1.25rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={skill.name}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: 500,
                            fontSize: "1rem",
                            color: bodyColor,
                          },
                        }}
                      />
                      <Box
                        sx={{
                          ml: "auto",
                          ...getInlineFieldSx(
                            `skills.${categoryIndex}.${itemIndex}.proficiency`,
                          ),
                          cursor: "pointer",
                          borderRadius: "16px",
                        }}
                        {...createInlineFieldProps(
                          `skills.${categoryIndex}.${itemIndex}.proficiency`,
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          const props = createInlineFieldProps(
                            `skills.${categoryIndex}.${itemIndex}.proficiency`,
                          );
                          if (props.onClick) props.onClick(e as any);
                        }}
                      >
                        <Chip
                          label={`${Math.round(skill.proficiency / 20) * 20}%`}
                          size="small"
                          sx={{
                            backgroundColor: softBackground,
                            color: primaryAccent,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        ))}

        {/* Add Card Button */}
        {onAddAction && (
          <Card
            sx={{
              background: "transparent",
              border: `2px dashed ${primaryAccent}50`,
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: primaryAccent,
                background: `${softBackground}`,
              },
            }}
            onClick={(event) =>
              onAddAction("services", event.currentTarget as HTMLElement)
            }
          >
            <CardContent
              sx={{
                textAlign: "center",
                color: primaryAccent,
              }}
            >
              <Box sx={{ fontSize: "2rem", mb: 1 }}>+</Box>
              <Typography sx={{ fontWeight: 600 }}>
                Add Development Card
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default ServicesSection;
