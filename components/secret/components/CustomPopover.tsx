import { useThemeContext } from "@/context/ThemeContext";
import { Chip, Popover, Stack, Typography } from "@mui/material";

interface CustomPopoverProps {
  anchorEl: HTMLElement | null;
  selectedInlineFieldId: string | null;
  handleCloseInlineEditor: () => void;
  getInlineFieldLabel: (fieldId: string) => string;
  renderInlineFieldToolbox: () => React.ReactNode;
}

export const CustomPopover = ({
  anchorEl,
  selectedInlineFieldId,
  handleCloseInlineEditor,
  getInlineFieldLabel,
  renderInlineFieldToolbox,
}: CustomPopoverProps) => {
  const { isDarkMode } = useThemeContext();
  return (
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
      {selectedInlineFieldId && (
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {getInlineFieldLabel(selectedInlineFieldId)}
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
  );
};
