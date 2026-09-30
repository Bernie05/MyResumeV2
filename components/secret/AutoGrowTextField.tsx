"use client";

import { TextField, type TextFieldProps } from "@mui/material";

const TEXT_TYPES = [undefined, "text", "url", "email", "tel", "search"];

// Every text input in the editor: wraps long values (URLs, descriptions, CSV
// lists) instead of truncating them in the narrow sidebar, using one auto-growing
// textarea. Numbers, selects and explicitly multiline fields are left alone.
// A textarea would accept line breaks, so Enter and pasted newlines are dropped
// to keep single-line fields single-line.
const AutoGrowTextField = (props: TextFieldProps) => {
  const { sx, onChange, onKeyDown, ...rest } = props;
  const grow = !props.select && props.multiline === undefined && TEXT_TYPES.includes(props.type);
  const readable = {
    "& .MuiInputBase-input": { fontSize: "0.9375rem", lineHeight: 1.5, overflowWrap: "anywhere" },
  };
  const merged = [readable, ...(Array.isArray(sx) ? sx : [sx])];

  if (!grow) return <TextField {...props} sx={merged} />;
  return (
    <TextField
      {...rest}
      multiline
      sx={merged}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.preventDefault();
        onKeyDown?.(event);
      }}
      onChange={(event) => {
        event.target.value = event.target.value.replace(/\s*[\r\n]+\s*/g, " ");
        onChange?.(event);
      }}
    />
  );
};

export default AutoGrowTextField;
