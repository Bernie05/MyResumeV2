"use client";

import Image from "next/image";
import { Box, ListItemIcon, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { templateOptions, type TemplateId } from "@/components/templates";

interface DesignPickerProps {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

const Thumb = ({ src }: { src: string }) => (
  <Image src={src} alt="" width={48} height={30} style={{ borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
);

// Design dropdown for the sidebar: thumbnail + label in the trigger and in each
// option. MUI Select is a keyboard-operable listbox (arrows, type-ahead, Esc).
const DesignPicker = ({ value, onChange }: DesignPickerProps) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      id="design-picker-label"
      component="label"
      sx={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5, px: 0.5 }}
    >
      Design
    </Typography>
    <Select
      fullWidth
      size="small"
      value={value}
      labelId="design-picker-label"
      onChange={(event) => onChange(event.target.value as TemplateId)}
      renderValue={(id) => {
        const option = templateOptions.find((o) => o.id === id);
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {option && <Thumb src={option.thumbnail} />}
            <Typography component="span" sx={{ fontSize: "0.875rem", fontWeight: 600 }} noWrap>
              {option?.label}
            </Typography>
          </Box>
        );
      }}
      sx={{ "& .MuiSelect-select": { py: 0.75 } }}
      MenuProps={{ slotProps: { paper: { sx: { color: "text.primary" } } } }}
    >
      {templateOptions.map((option) => (
        <MenuItem key={option.id} value={option.id} sx={{ gap: 1.25, py: 1 }}>
          <Thumb src={option.thumbnail} />
          <ListItemText
            primary={option.label}
            slotProps={{ primary: { sx: { fontSize: "0.875rem", fontWeight: option.id === value ? 700 : 500 } } }}
          />
          {option.id === value && (
            <ListItemIcon sx={{ minWidth: 0 }}>
              <CheckIcon fontSize="small" />
            </ListItemIcon>
          )}
        </MenuItem>
      ))}
    </Select>
  </Box>
);

export default DesignPicker;
