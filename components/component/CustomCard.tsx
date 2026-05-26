import React from "react";
import { Card, CardProps, SxProps } from "@mui/material";
import { useThemeContext } from "../../context/ThemeContext";
import { getSectionPalette } from "../../theme/sectionPalette";
import { withEditableField } from "../hoc/withEditableField";

interface CustomCardProps extends Omit<CardProps, "sx"> {
  sx?: SxProps;
  children: React.ReactNode;
  targetSectionId?: any;
  targetFieldId?: any;
}

const BaseCard = React.forwardRef<HTMLDivElement, CustomCardProps>(
  ({ sx, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        sx={{
          ...sx,
        }}
        {...props}
      />
    );
  },
);

export const CustomCard = withEditableField(BaseCard);
