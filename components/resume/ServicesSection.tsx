"use client";

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
} from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";

interface SkillItem {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

const SKILL_ICONS: Record<string, any> = {
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

function getIconForSkill(skillName: string): any {
  const name = skillName.toLowerCase();
  for (const [key, icon] of Object.entries(SKILL_ICONS)) {
    if (name.includes(key)) return icon;
  }

  return SKILL_ICONS.default;
}

export default function ServicesSection({
  skills,
}: {
  skills: SkillCategory[];
}) {
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
          }}
        >
          What I Offer
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.125rem",
            color: mutedColor,
            fontWeight: 400,
          }}
        >
          Professional services tailored to your project needs
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
        {skills.slice(0, 2).map((category) => (
          <Card
            key={category.category}
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
                    borderRadius: "0.75rem",
                    backgroundColor: softBackground,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CodeIcon
                    sx={{
                      fontSize: "1.75rem",
                      color: primaryAccent,
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: titleColor,
                    }}
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
                    }}
                  >
                    Expert {category.category.toLowerCase()} solutions
                  </Typography>
                </Box>
              </Box>

              {/* Skills List */}
              <List sx={{ p: 0, m: 0 }}>
                {category.items.slice(0, 4).map((skill) => {
                  const IconComponent = getIconForSkill(skill.name);
                  return (
                    <ListItem
                      key={skill.name}
                      sx={{
                        p: 0,
                        mb: 2,
                        alignItems: "center",
                        "&:last-child": { mb: 0 },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "32px",
                          color: primaryAccent,
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
                      <Box sx={{ ml: "auto" }}>
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
      </Box>
    </Box>
  );
}
