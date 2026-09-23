"use client";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Badge as BadgeIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { useInlineEditing } from "@/hook/useInlineEditing";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { AddButton } from "../component/static/AddButton";
import {
  useEditor,
  useActiveField,
  useOnFieldClick,
  useIsEditMode,
} from "@/hook/useEditor";

interface CharacterReference {
  id: number;
  name: string;
  company: string;
  position: string;
  contactNo: string;
}

interface ICharacterReferencesProps {
  characterReferences?: CharacterReference[];
  characterReferencesBadge?: string;
  characterReferencesTitle?: string;
}

const CharacterReferences = ({
  characterReferences = [],
  characterReferencesBadge,
  characterReferencesTitle,
}: ICharacterReferencesProps) => {
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
  const isEditMode = useIsEditMode();

  const { onDeleteAction, onAddAction } = editor || {};

  const { getInlineFieldSx, createInlineFieldProps } = useInlineEditing({
    targetSection: "characterReferences",
    activeInlineFieldId,
    onInlineFieldClick,
  });

  if (characterReferences.length === 0 && !onAddAction) {
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
            background: buttonGradient,
            color: accentText,
            fontWeight: 700,
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            mb: 2,
            ...getInlineFieldSx("characterReferencesBadge"),
            borderRadius: 999,
          }}
          {...createInlineFieldProps("characterReferencesBadge")}
        >
          {characterReferencesBadge || "Character References"}
        </Box>
        {/* Section Title */}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: titleColor,
            fontSize: { xs: "1.875rem", md: "2.25rem" },
            ...getInlineFieldSx("characterReferencesTitle"),
          }}
          {...createInlineFieldProps("characterReferencesTitle")}
        >
          {characterReferencesTitle || "People Who Vouch For Me"}
        </Typography>
      </Box>

      {/* Character Reference Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {/* Character Reference Cards */}
        {characterReferences.map((reference, index) => (
          <Card
            key={reference.id}
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
            {/* Delete Button */}
            {onDeleteAction && (
              <IconButton
                aria-label="Delete character reference"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteAction(`characterReferences.${index}`);
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

            {/* Content */}
            <CardContent sx={{ p: 3 }}>
              <BadgeIcon
                sx={{
                  fontSize: "2.25rem",
                  color: primaryAccent,
                  mb: 1,
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: primaryAccent,
                  }}
                >
                  {reference.name?.charAt(0)?.toUpperCase() ?? "?"}
                </Avatar>

                {/* Reference Details */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      color: reference.name ? titleColor : mutedColor,
                      fontStyle: reference.name ? "normal" : "italic",
                      ...getInlineFieldSx(`characterReferences.${index}.name`),
                    }}
                    {...createInlineFieldProps(
                      `characterReferences.${index}.name`,
                    )}
                  >
                    {reference.name || (isEditMode ? "+ Add name" : "")}
                  </Typography>

                  {/* Position and Company */}
                  {((reference.position && reference.company) ||
                    isEditMode) && (
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ color: mutedColor }}
                    >
                      {/* Position */}
                      <Box
                        component="span"
                        sx={{
                          fontStyle: reference.position ? "normal" : "italic",
                          ...getInlineFieldSx(
                            `characterReferences.${index}.position`,
                          ),
                        }}
                        {...createInlineFieldProps(
                          `characterReferences.${index}.position`,
                        )}
                      >
                        {reference.position ||
                          (isEditMode ? "+ Add position" : "")}
                      </Box>
                      {/* Company */}
                      {(reference.company || isEditMode) && (
                        <>
                          {" · "}
                          <Box
                            component="span"
                            sx={{
                              fontStyle: reference.company
                                ? "normal"
                                : "italic",
                              ...getInlineFieldSx(
                                `characterReferences.${index}.company`,
                              ),
                            }}
                            {...createInlineFieldProps(
                              `characterReferences.${index}.company`,
                            )}
                          >
                            {reference.company ||
                              (isEditMode ? "+ Add company" : "")}
                          </Box>
                        </>
                      )}
                    </Typography>
                  )}

                  {/* Contact Number */}
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      color: reference.contactNo ? bodyColor : mutedColor,
                      fontStyle: reference.contactNo ? "normal" : "italic",
                      mt: 0.5,
                      ...getInlineFieldSx(
                        `characterReferences.${index}.contactNo`,
                      ),
                    }}
                    {...createInlineFieldProps(
                      `characterReferences.${index}.contactNo`,
                    )}
                  >
                    {reference.contactNo ||
                      (isEditMode ? "+ Add contact no." : "")}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add Character Reference Button */}
      {onAddAction && (
        <AddButton targetSectionId="characterReferences">
          <Typography
            sx={{ color: primaryAccent, fontWeight: 600, fontSize: "1rem" }}
          >
            + Add Character Reference
          </Typography>
        </AddButton>
      )}
    </Box>
  );
};

export default CharacterReferences;
