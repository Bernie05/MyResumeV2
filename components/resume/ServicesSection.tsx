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
  IconButton,
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
  DeleteOutline as DeleteOutlineIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  RocketLaunch as RocketLaunchIcon,
  Star as StarIcon,
  Lightbulb as LightbulbIcon,
  EmojiEvents as EmojiEventsIcon,
  Handshake as HandshakeIcon,
  GpsFixed as GpsFixedIcon,
  CalendarMonth as CalendarMonthIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import { IEditorProps } from "../secret/SecretResumeEditor";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";
import { CustomTypography } from "../component/CustomTypography";
import { TECH_ICON_MAP } from "@/components/resume/constants/techIcons";
import { useInlineEditing } from "@/hook/useInlineEditing";

import type { ServiceCard } from "@/types/resume";

// Item-level skill icons (services.N.N.icon) are picked from TECH_ICON_MAP
// (react-icons, keyed by technology name e.g. "react", "docker") in the
// editor toolbox — a different key space from ICON_MAP (MUI icons, used for
// card-level icons like services.N.icon). Keep both namespaces distinct here
// so lookups for one never silently miss because they were tried against the
// other.
const SKILL_ICON_SIZE = 20;

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
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  rocket: RocketLaunchIcon,
  star: StarIcon,
  lightbulb: LightbulbIcon,
  award: EmojiEventsIcon,
  handshake: HandshakeIcon,
  target: GpsFixedIcon,
  calendar: CalendarMonthIcon,
  mail: EmailIcon,
  search: SearchIcon,
  support: SupportAgentIcon,
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

// Item-level skill icons (services.N.N.icon) are picked from TECH_ICON_MAP
// (react-icons, keyed by technology name e.g. "react", "docker") in the
// editor toolbox — a different key space from ICON_MAP (MUI icons, used for
// card-level icons like services.N.icon). Look up TECH_ICON_MAP first so a
// picked item icon actually resolves; MUI's <Box component={...}> renders
// either family through the same `sx` styling, so callers don't need to
// branch on which family they got back.
const getIconForSkill = (
  skillName: string,
  iconKey?: string,
): React.ElementType => {
  if (iconKey && TECH_ICON_MAP[iconKey]) {
    return TECH_ICON_MAP[iconKey] as React.ElementType;
  }
  if (iconKey && ICON_MAP[iconKey]) {
    return ICON_MAP[iconKey];
  }
  const name = skillName.toLowerCase();
  for (const [key, icon] of Object.entries(SKILL_ICONS)) {
    if (name.includes(key)) return icon;
  }

  return SKILL_ICONS.default;
};

// Card-level icons (services.N.icon) are picked from ICON_MAP (MUI icons,
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

export interface IServiceSection extends IEditorProps {
  services: ServiceCard[];
  servicesBadge: string | undefined;
  servicesTitle: string | undefined;
  servicesSubtitle: string | undefined;
}

// ServicesSection is a React component that renders a section of service cards, each representing a specific service offered. The component accepts props for the services data, section badge, title, subtitle, and optional handlers for inline editing and adding/deleting services. It utilizes MUI components for layout and styling, and provides interactive features such as inline editing of service details and the ability to add or remove services dynamically.
const ServicesSection = ({
  services,
  servicesBadge,
  servicesTitle,
  servicesSubtitle,
  onInlineFieldClick,
  activeInlineFieldId,
  onAddAction,
  onDeleteAction,
}: {
  services: ServiceCard[];
  servicesBadge?: string;
  servicesTitle?: string;
  servicesSubtitle?: string;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId,
    anchor?: HTMLElement,
  ) => void;
  activeInlineFieldId?: InlineEditableFieldId | null;
  onAddAction?: (action: string, anchor: HTMLElement) => void;
  onDeleteAction?: (action: string) => void;
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

  // Shared with Experience/Portfolio/Projects — this used to be a
  // hand-rolled copy of the same outline/hover sx and click/keydown wiring
  // that useInlineEditing already provides. ServicesSection differs from
  // those three only in that it receives activeInlineFieldId/
  // onInlineFieldClick as props (from ResumePage) rather than reading them
  // via useActiveField()/useOnFieldClick(); useInlineEditing accepts either
  // way, so that difference stays intact.
  const { getInlineFieldSx, createInlineFieldProps } = useInlineEditing({
    targetSection: "services",
    activeInlineFieldId,
    onInlineFieldClick,
  });

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
        {/* Section Badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.75,
            py: 0.75,
            background: buttonGradient,
            color: accentText,
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            mb: 2,
            ...getInlineFieldSx("servicesBadge"),
            borderRadius: 999,
          }}
          {...createInlineFieldProps("servicesBadge")}
        >
          {servicesBadge || "Services"}
        </Box>

        {/* Section Title */}
        <CustomTypography
          variant="h3"
          targetSectionId="services"
          targetFieldId="servicesTitle"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: titleColor,
            mb: 2,
          }}
        >
          {servicesTitle || "What I Offer"}
        </CustomTypography>

        {/* Section Subtitle */}
        <CustomTypography
          variant="h6"
          targetSectionId="services"
          targetFieldId="servicesSubtitle"
        >
          {servicesSubtitle ||
            "Professional services tailored to your project needs"}
        </CustomTypography>
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
        {/* Service Cards */}
        {services.map((card, cardIndex) => (
          <Card
            key={card.id}
            sx={{
              background: surfaceBackground,
              border: `1px solid ${outline}`,
              borderRadius: "1rem",
              transition: "all 0.3s ease",
              height: "100%",
              position: "relative",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: hoverShadow,
              },
            }}
          >
            {/* Delete Button */}
            {onDeleteAction && (
              <IconButton
                aria-label="Delete service card"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteAction(`services.${cardIndex}`);
                }}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 2,
                  backgroundColor: "rgba(0,0,0,0.55)",
                  color: "common.white",
                  width: 38,
                  height: 38,
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.16)",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                  opacity: 0.9,
                  "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "rgba(0,0,0,0.75)",
                  },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
            {/* Service Content */}
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
                {/* Icon */}
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: softBackground,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                  }}
                  {...createInlineFieldProps(`services.${cardIndex}.icon`)}
                >
                  {/* Highlight target sized to the icon itself, not the
                      padded chip background above, so the edit-mode outline
                      hugs the icon instead of the whole badge. */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...getInlineFieldSx(`services.${cardIndex}.icon`),
                    }}
                  >
                    {React.createElement(
                      getCategoryIcon(card.title, card.icon),
                      {
                        sx: {
                          fontSize: "1.75rem",
                          color: primaryAccent,
                          display: "block",
                        },
                      },
                    )}
                  </Box>
                </Box>
                {/* Title and Subtitle */}
                <Box>
                  <CustomTypography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: titleColor,
                      ...getInlineFieldSx(`services.${cardIndex}.title`),
                    }}
                    {...createInlineFieldProps(`services.${cardIndex}.title`)}
                  >
                    {card.title || "Development"}
                  </CustomTypography>
                  {/* Subtitle */}
                  <CustomTypography
                    variant="caption"
                    sx={{
                      fontSize: "0.875rem",
                      color: mutedColor,
                      display: "block",
                      mt: 0.5,
                      ...getInlineFieldSx(`services.${cardIndex}.subtitle`),
                    }}
                    {...createInlineFieldProps(
                      `services.${cardIndex}.subtitle`,
                    )}
                  >
                    {card.subtitle ||
                      `Expert ${card.title.toLowerCase()} solutions`}
                  </CustomTypography>
                </Box>
              </Box>

              {/* Skills List */}
              <List sx={{ p: 0, m: 0 }}>
                {card.items.map((skill, itemIndex) => {
                  const IconComponent = getIconForSkill(skill.name, skill.icon);
                  return (
                    <ListItem
                      key={skill.id}
                      sx={{
                        p: 0,
                        mb: 2,
                        alignItems: "center",
                        "&:last-child": { mb: 0 },
                        ...getInlineFieldSx(
                          `services.${cardIndex}.${itemIndex}.name`,
                        ),
                      }}
                      {...createInlineFieldProps(
                        `services.${cardIndex}.${itemIndex}.name`,
                      )}
                    >
                      {/* Icon */}
                      <ListItemIcon
                        sx={{
                          minWidth: "32px",
                          color: primaryAccent,
                          ...getInlineFieldSx(
                            `services.${cardIndex}.${itemIndex}.icon`,
                          ),
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const props = createInlineFieldProps(
                            `services.${cardIndex}.${itemIndex}.icon`,
                          );
                          if (props.onClick) props.onClick(e as any);
                        }}
                      >
                        <Box
                          component={IconComponent}
                          sx={{ fontSize: SKILL_ICON_SIZE, flexShrink: 0 }}
                        />
                      </ListItemIcon>

                      {/* Skill Name */}
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
                      {/* Proficiency Chip */}
                      <Box
                        sx={{
                          ml: "auto",
                          cursor: "pointer",
                          borderRadius: "16px",
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

              {/* Add Skill (scoped to this card) */}
              {onAddAction && (
                <Box
                  role="button"
                  tabIndex={0}
                  aria-label="Add skill to this card"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddAction(
                      `services.${cardIndex}.item`,
                      event.currentTarget as HTMLElement,
                    );
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      onAddAction(
                        `services.${cardIndex}.item`,
                        event.currentTarget as HTMLElement,
                      );
                    }
                  }}
                  sx={{
                    mt: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: primaryAccent,
                    cursor: "pointer",
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    "&:hover": {
                      backgroundColor: softBackground,
                    },
                  }}
                >
                  + Add Skill
                </Box>
              )}
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
            onClick={(event) => {
              event.stopPropagation();
              onAddAction("services", event.currentTarget as HTMLElement);
            }}
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
