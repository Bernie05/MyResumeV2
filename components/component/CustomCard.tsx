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

// CustomCard is a React component that wraps the MUI Card component and enhances it with editable field functionality. It accepts standard CardProps, along with additional props for styling (sx), children, and identifiers for the target section and field. The component is wrapped with the withEditableField HOC to provide editing capabilities in the context of a resume editor application.
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

BaseCard.displayName = "BaseCard";

// Wrap the BaseCard component with the withEditableField HOC to create the CustomCard component, which includes editable field functionality. This allows the card to be interactive and editable within the context of a resume editor application.
export const CustomCard = withEditableField(BaseCard);
