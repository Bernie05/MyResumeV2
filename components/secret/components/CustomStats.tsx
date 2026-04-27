import { HeroStats } from "@/components/resume/HeroSection";
import { useAnimatedStats } from "@/hook/useAnimated";
import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";
import {
  createInlineFieldProps,
  getInlineFieldSxV2,
} from "../utils/componentUtil";
import { useThemeContext } from "@/context/ThemeContext";
import { getSectionPalette } from "@/theme/sectionPalette";
import { IEditorProps } from "../SecretResumeEditor";
import { ResumeEditableSection } from "@/components/resume/ResumePage";

interface ICustomStatsProps extends IEditorProps {
  stats: HeroStats;
}

export const CustomStats = ({
  stats,
  isEditMode,
  activeInlineFieldId,
  onInlineFieldClick,
  onAddAction,
}: ICustomStatsProps) => {
  const { isDarkMode } = useThemeContext();
  const { primaryAccent } = getSectionPalette(isDarkMode);

  const inlineFieldClick = onInlineFieldClick as
    | ((
        section: ResumeEditableSection,
        fieldId: string,
        anchor?: HTMLElement,
      ) => void)
    | undefined;

  return (
    <>
      {(stats.custom ?? []).map((customStat, idx) => (
        <Box
          key={`custom-stat-${idx}`}
          sx={{
            flex: "1 1 180px",
            maxWidth: { xs: "100%", sm: 220 },
            minWidth: { xs: 130, sm: 160 },
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 800,
              color: primaryAccent,
              lineHeight: 1,
              mb: 1,
              ...getInlineFieldSxV2({
                fieldId: `stats.custom.${idx}`,
                activeInlineFieldId,
                isEditMode,
              }),
            }}
            {...createInlineFieldProps(
              "stats",
              `stats.custom.${idx}`,
              inlineFieldClick,
            )}
          >
            {customStat.value.toLocaleString()}
            {customStat.suffix}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.85rem", md: "1rem" },
              fontWeight: 600,
              color: isDarkMode ? "#cbd5e1" : "#64748b",
              maxWidth: 180,
            }}
          >
            {customStat.label}
          </Typography>
        </Box>
      ))}
      {onAddAction && (
        <Box
          sx={{
            flex: "1 1 180px",
            maxWidth: { xs: "100%", sm: 220 },
            minWidth: { xs: 130, sm: 160 },
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 1, sm: 2 },
            cursor: "pointer",
            border: `2px dashed ${primaryAccent}50`,
            borderRadius: 2,
            py: 2,
            "&:hover": { borderColor: primaryAccent },
          }}
          onClick={(event) =>
            onAddAction("stat", event.currentTarget as HTMLElement)
          }
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 800,
              color: primaryAccent,
              lineHeight: 1,
              mb: 1,
            }}
          >
            +
          </Typography>
          <Typography
            sx={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: primaryAccent,
            }}
          >
            Add Stat
          </Typography>
        </Box>
      )}
    </>
  );
};
