import { useMemo } from "react";
import type { ResumeEditableSection } from "@/components/resume/ResumePage";
import type { InlineEditableFieldId } from "@/components/secret/constants/constant";

interface UseInlineEditingProps {
  targetSection?: ResumeEditableSection;
  itemIndex?: number;
  activeInlineFieldId?: string | null;
  onInlineFieldClick?: (
    section: ResumeEditableSection,
    fieldId: InlineEditableFieldId,
    anchor?: HTMLElement,
  ) => void;
}

export const useInlineEditing = ({
  targetSection,
  itemIndex,
  activeInlineFieldId,
  onInlineFieldClick,
}: UseInlineEditingProps) => {
  const isActiveField = (fieldId: string | null) => {
    return fieldId && onInlineFieldClick;
  };

  const buildFieldId = useMemo(
    () => (fieldName: string) => {
      if (!inlineSection || itemIndex === undefined) {
        return null;
      }

      // Ex. project.0.name
      return `${inlineSection}.${itemIndex}.${fieldName}`;
    },
    [inlineSection, itemIndex],
  );

  const getInlineFieldSx = useMemo(
    () => (fieldId: string | null) => ({
      borderRadius: 1,
      outline:
        fieldId && activeInlineFieldId === fieldId
          ? "2px solid rgba(20, 184, 166, 0.9)"
          : "2px solid transparent",
      outlineOffset: 2,
      cursor: isActiveField(fieldId) ? "pointer" : "inherit",
      transition: "outline-color 160ms ease, box-shadow 160ms ease",
      "&:hover": isActiveField(fieldId)
        ? {
            outlineColor: "rgba(20, 184, 166, 0.55)",
            boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
          }
        : undefined,
    }),
    [activeInlineFieldId, onInlineFieldClick],
  );

  const createInlineFieldProps = useMemo(
    () => (fieldId: string | null) => {
      if (!fieldId || !targetSection || !onInlineFieldClick) {
        return {};
      }

      return {
        onClick: (event: React.MouseEvent) => {
          event.stopPropagation();
          onInlineFieldClick(
            targetSection,
            fieldId,
            event.currentTarget as HTMLElement,
          );
        },
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            onInlineFieldClick(
              targetSection,
              fieldId,
              event.currentTarget as HTMLElement,
            );
          }
        },
        role: "button",
        tabIndex: 0,
        "aria-label": `Edit ${fieldId}`,
      };
    },
    [targetSection, onInlineFieldClick],
  );

  const getSectionField = {
    Project: [
      "name",
      "description",
      "image",
      "technologies",
      "testimonial",
      "client",
    ],
  };

  const getFieldBySection = (section: string) => {
    return getSectionField[section as keyof typeof getSectionField] || [];
  };

  const getSectionBuildFieldIds = (section: string, isInitialize?: boolean) => {
    const fields = getFieldBySection(section);

    return fields.reduce(
      (acc, field) => {
        acc[field] = isInitialize ? null : buildFieldId(field);
        return acc;
      },
      {} as Record<string, string | null>,
    );
  };

  const fieldIds = useMemo(() => {
    if (!inlineSection || itemIndex === undefined) {
      // Initialize all field IDs to null when not in edit mode to prevent stale IDs from previous edits
      return {
        ...(getSectionBuildFieldIds(sectionId, true) as any),
      };
    }

    // Return the actual field IDs for the current inline section and item index
    return {
      ...(getSectionBuildFieldIds(sectionId) as any),
    };
  }, [inlineSection, itemIndex, buildFieldId]);

  return {
    targetSection,
    buildFieldId,
    getInlineFieldSx,
    createInlineFieldProps,
    fieldIds,
  };
};
