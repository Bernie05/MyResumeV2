import {
  useEditor as useEditorContext,
  type EditorContextValue,
} from "../context/EditorContext";

// This file defines custom hooks that provide convenient access to the EditorContext.
export const useEditor = (): EditorContextValue | null => {
  return useEditorContext();
};

// useIsEditMode is a custom hook that checks if the editor is currently in edit mode.
export const useIsEditMode = (): boolean => {
  return useEditorContext()?.isEditMode ?? false;
};

// FIELD LEVEL INTERACTIONS
// useActiveField is a custom hook that retrieves the active inline field ID from the editor context.
export const useActiveField = () => {
  return useEditorContext()?.activeInlineFieldId;
};

// useActiveSection is a custom hook that retrieves the active section from the editor context.
export const useOnFieldClick = () => {
  return useEditorContext()?.onInlineFieldClick;
};

// useIsFieldActive is a custom hook that checks if a given field ID matches the active inline field ID from the editor context.
export const useIsFieldActive = (fieldId: string): boolean => {
  return useActiveField() === fieldId;
};

export const useFieldEditorState = (targetFieldId: string) => {
  // Hooks to access editor state and interactions
  const isEditMode = useIsEditMode();
  const activeFieldId = useActiveField();
  const onFieldClick = useOnFieldClick();

  // Determine if the target field is currently active
  const isActive = activeFieldId === targetFieldId;

  return {
    isEditMode,
    isActive,
    onFieldClick,
    cursor: isEditMode ? "pointer" : "inherit", // Change cursor to pointer in edit mode
    outline: isActive
      ? "2px solid rgba(20, 184, 166, 0.9)"
      : "2px solid transparent",
  };
};

// SECTION LEVEL INTERACTIONS
// useActiveSection is a custom hook that retrieves the active section from the editor context.
export const useActiveSection = () => {
  return useEditorContext()?.activeSection ?? null;
};

// useOnSectionClick is a custom hook that retrieves the onSectionClick handler from the editor context.
export const useOnSectionClick = () => {
  return useEditorContext()?.onSectionClick;
};
