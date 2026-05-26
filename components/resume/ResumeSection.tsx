/**
 * Reusable Resume Section Component
 * Used across all resume sections (Experience, Education, Skills, etc.)
 */

"use client";

import React, { ReactNode } from "react";
import { Box, Typography, IconButton, SxProps, Theme } from "@mui/material";
import {
  DeleteOutline as DeleteOutlineIcon,
  Add as AddIcon,
} from "@mui/icons-material";

export interface ResumeSectionProps {
  /** Section title */
  title: string;
  /** Section icon */
  icon?: ReactNode;
  /** Items to render */
  items: Array<{ id?: string | number }>;
  /** Render function for each item */
  renderItem: (item: any, index: number) => ReactNode;
  /** Called when add button is clicked */
  onAdd?: () => void;
  /** Called when delete button is clicked */
  onDelete?: (id: string | number | undefined, index: number) => void;
  /** Show empty state */
  isEmpty?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Custom styles */
  sx?: SxProps<Theme>;
  /** Show add button */
  showAddButton?: boolean;
  /** Show delete buttons */
  showDeleteButtons?: boolean;
  /** Custom actions in header */
  actions?: ReactNode;
}

export const ResumeSection = React.forwardRef<
  HTMLDivElement,
  ResumeSectionProps
>(
  (
    {
      title,
      icon,
      items,
      renderItem,
      onAdd,
      onDelete,
      isEmpty = false,
      emptyMessage = "No items added",
      isLoading = false,
      error = null,
      sx = {},
      showAddButton = !!onAdd,
      showDeleteButtons = !!onDelete,
      actions,
    },
    ref,
  ) => {
    return (
      <Box
        ref={ref}
        sx={{
          mb: 3,
          ...sx,
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 1,
            borderBottom: "2px solid",
            borderColor: "primary.main",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon && <Box>{icon}</Box>}
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {actions && <Box>{actions}</Box>}
            {showAddButton && onAdd && (
              <IconButton
                size="small"
                onClick={onAdd}
                title={`Add ${title.toLowerCase()}`}
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Typography variant="body2" color="textSecondary">
            Loading...
          </Typography>
        )}

        {/* Error State */}
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}

        {/* Empty State */}
        {isEmpty && !isLoading && (
          <Typography variant="body2" color="textSecondary">
            {emptyMessage}
          </Typography>
        )}

        {/* Items */}
        {!isLoading && !isEmpty && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {items.map((item, index) => (
              <Box
                key={item.id || index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>{renderItem(item, index)}</Box>
                {showDeleteButtons && onDelete && (
                  <IconButton
                    size="small"
                    onClick={() => onDelete(item.id, index)}
                    title="Delete"
                    color="error"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  },
);

ResumeSection.displayName = "ResumeSection";
