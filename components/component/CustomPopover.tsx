import { useThemeContext } from "@/context/ThemeContext";
import { Chip, Popover, Stack, Typography } from "@mui/material";
import { ThemeProvider, type Theme } from "@mui/material/styles";
import { InlineEditableFieldId } from "../secret/constants/constant";

// The app's light palette uses near-white text.primary (meant for the resume
// page), which is unreadable on the popover's white panel. Give the popover
// readable dark text in light mode without changing the global theme.
const withReadableLightText = (outerTheme: Theme): Theme =>
  outerTheme.palette.mode === "light"
    ? {
        ...outerTheme,
        palette: {
          ...outerTheme.palette,
          text: {
            ...outerTheme.palette.text,
            primary: "rgba(15, 23, 42, 0.92)",
            secondary: "rgba(15, 23, 42, 0.65)",
          },
        },
      }
    : outerTheme;

interface CustomPopoverProps {
  anchorEl: HTMLElement | null;
  selectedInlineFieldId: string | null;
  handleCloseInlineEditor: () => void;
  getInlineFieldLabel: (selectedInlineFieldId: InlineEditableFieldId) => string;
  renderInlineFieldToolbox: () => React.ReactNode;
}

export const CustomPopover = ({
  anchorEl,
  selectedInlineFieldId,
  handleCloseInlineEditor,
  getInlineFieldLabel,
  renderInlineFieldToolbox,
}: CustomPopoverProps) => {
  // Access the theme context to determine if dark mode is active.
  // This will be used to style the Popover component accordingly, ensuring that it matches the overall theme of the application.
  const { isDarkMode } = useThemeContext();

  // Render the Popover component, which is a floating container that appears when an inline field is selected for editing. The Popover is anchored to the specified element (anchorEl) and displays the label of the selected inline field along with a toolbox for editing. The appearance of the Popover is customized based on the current theme (dark or light mode).
  return (
    <ThemeProvider theme={withReadableLightText}>
      <Popover
        open={Boolean(anchorEl) && Boolean(selectedInlineFieldId)}
        anchorEl={anchorEl}
        onClose={handleCloseInlineEditor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              p: 2.5,
              minWidth: 300,
              maxWidth: 520,
              maxHeight: "70vh",
              overflowY: "auto",
              borderRadius: 3,
              border: "2px solid",
              borderColor: isDarkMode
                ? "rgba(20, 184, 166, 0.5)"
                : "rgba(15, 118, 110, 0.35)",
              backgroundColor: isDarkMode
                ? "rgba(15, 23, 42, 0.97)"
                : "rgba(255, 255, 255, 0.97)",
              backdropFilter: "blur(12px)",
              boxShadow: isDarkMode
                ? "0 8px 32px rgba(0, 0, 0, 0.5)"
                : "0 8px 32px rgba(0, 0, 0, 0.15)",
            },
          },
        }}
      >
        {/* Popover content */}
        {selectedInlineFieldId && (
          <Stack spacing={1.5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {getInlineFieldLabel(
                  selectedInlineFieldId as InlineEditableFieldId,
                )}
              </Typography>
              <Chip
                size="small"
                label="Editing"
                color="primary"
                variant="filled"
              />
            </Stack>
            {renderInlineFieldToolbox()}
          </Stack>
        )}
      </Popover>
    </ThemeProvider>
  );
};
