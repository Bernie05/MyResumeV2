"use client";

import { Avatar, Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import {
  FormatQuote as FormatQuoteIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { useInlineEditing } from "@/hook/useInlineEditing";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { AddButton } from "../component/static/AddButton";
import { useEditor, useActiveField, useOnFieldClick } from "@/hook/useEditor";

interface Testimonial {
  id: number;
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany?: string;
  photoUrl?: string;
}

interface ITestimonialsProps {
  testimonials?: Testimonial[];
}

const Testimonials = ({ testimonials = [] }: ITestimonialsProps) => {
  const { isDarkMode } = useThemeContext();
  const {
    primaryAccent,
    titleColor,
    bodyColor,
    mutedColor,
    sectionBackground,
    surfaceBackground,
    outline,
    buttonGradient,
    accentText,
    hoverShadow,
  } = getSectionPalette(isDarkMode);

  const editor = useEditor();
  const activeInlineFieldId = useActiveField();
  const onInlineFieldClick = useOnFieldClick();

  const { onDeleteAction, onAddAction } = editor || {};

  const { getInlineFieldSx, createInlineFieldProps } = useInlineEditing({
    targetSection: "testimonials",
    activeInlineFieldId,
    onInlineFieldClick,
  });

  if (testimonials.length === 0 && !onAddAction) {
    return null;
  }

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4.5 },
        borderRadius: { xs: 4, md: 5 },
        background: sectionBackground,
        border: `1px solid ${outline}`,
      }}
    >
      {/* Section Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "inline-flex",
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
          Testimonials
        </Box>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: titleColor,
            fontSize: { xs: "1.875rem", md: "2.25rem" },
          }}
        >
          What People Say
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {testimonials.map((testimonial, index) => (
          <Card
            key={testimonial.id}
            sx={{
              background: surfaceBackground,
              border: `1px solid ${outline}`,
              borderLeft: `4px solid ${primaryAccent}`,
              transition: "all 0.3s ease",
              position: "relative",
              "&:hover": {
                borderLeftColor: primaryAccent,
                boxShadow: hoverShadow,
              },
            }}
          >
            {onDeleteAction && (
              <IconButton
                aria-label="Delete testimonial"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteAction(`testimonials.${index}`);
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
            <CardContent sx={{ p: 3 }}>
              <FormatQuoteIcon
                sx={{
                  fontSize: "2.25rem",
                  color: primaryAccent,
                  transform: "scaleX(-1)",
                  mb: 1,
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  color: bodyColor,
                  mb: 2.5,
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  ...getInlineFieldSx(`testimonials.${index}.quote`),
                }}
                {...createInlineFieldProps(`testimonials.${index}.quote`)}
              >
                “{testimonial.quote}”
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={testimonial.photoUrl || undefined}
                  sx={{ width: 44, height: 44, bgcolor: primaryAccent }}
                >
                  {testimonial.authorName?.charAt(0) ?? "?"}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      color: titleColor,
                      ...getInlineFieldSx(`testimonials.${index}.authorName`),
                    }}
                    {...createInlineFieldProps(
                      `testimonials.${index}.authorName`,
                    )}
                  >
                    {testimonial.authorName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: mutedColor,
                      display: "block",
                      ...getInlineFieldSx(`testimonials.${index}.authorRole`),
                    }}
                    {...createInlineFieldProps(
                      `testimonials.${index}.authorRole`,
                    )}
                  >
                    {testimonial.authorRole}
                    {testimonial.authorCompany
                      ? ` · ${testimonial.authorCompany}`
                      : ""}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add Testimonial Button */}
      {onAddAction && (
        <AddButton targetSectionId="testimonials">
          <Typography
            sx={{ color: primaryAccent, fontWeight: 600, fontSize: "1rem" }}
          >
            + Add Testimonial
          </Typography>
        </AddButton>
      )}
    </Box>
  );
};

export default Testimonials;
