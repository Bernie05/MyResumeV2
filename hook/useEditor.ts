import {
  useEditor as useEditorContext,
  type EditorContextValue,
} from "../context/EditorContext";

// This file defines custom hooks that provide convenient access to the EditorContext.
export const useEditor = (): EditorContextValue => {
  return useEditorContext();
};

// useIsEditMode is a custom hook that checks if the editor is currently in edit mode.
export const useIsEditMode = (): boolean => {
  return useEditorContext().isEditMode ?? false;
};

// FIELD LEVEL INTERACTIONS
// useActiveField is a custom hook that retrieves the active inline field ID from the editor context.
export const useActiveField = () => {
  return useEditorContext().activeInlineFieldId;
};

// useActiveSection is a custom hook that retrieves the active section from the editor context.
export const useOnFieldClick = () => {
  return useEditorContext().onInlineFieldClick;
};

// useIsFieldActive is a custom hook that checks if a given field ID matches the active inline field ID from the editor context.
export const useIsFieldActive = (fieldId: string): boolean => {
  return useActiveField() === fieldId;
};

// TODO, we need to have a listener for the hover.
export const useFieldEditorState = (targetFieldId: string) => {
  // Hooks to access editor state and interactions
  const isEditMode = useIsEditMode();
  const activeFieldId = useActiveField();
  const onFieldClick = useOnFieldClick();

  console.log(
    "targetFieldId: ",
    targetFieldId,
    "activeFieldId: ",
    activeFieldId,
  );

  // Determine if the target field is currently active
  const isActive = isEditMode && activeFieldId === targetFieldId;

  return {
    isEditMode,
    isActive,
    onFieldClick,
    // cursor should be pointer if in edit mode, otherwise inherit
    cursor: isEditMode ? "pointer" : "inherit",

    // outline should be visible if active, otherwise transparent
    outline: isActive
      ? "2px solid rgba(20, 184, 166, 0.9)" // need to update depend on the theme
      : "",

    // hover styles will be handled in the component's sx using onFieldClick and isActive
    hover: {
      outlineColor: isActive
        ? "2px solid rgba(20, 184, 166, 0.9)" // need to update depend on the theme
        : "inherit",
      boxShadow: isActive ? "0 0 0 4px rgba(20, 184, 166, 0.2)" : "none",
    },
  };
};

// SECTION LEVEL INTERACTIONS
// useActiveSection is a custom hook that retrieves the active section from the editor context.
export const useActiveSection = () => {
  return useEditorContext().activeSection ?? null;
};

// useOnSectionClick is a custom hook that retrieves the onSectionClick handler from the editor context.
export const useOnSectionClick = () => {
  return useEditorContext().onSectionClick;
};

// useSetActiveFieldId is a custom hook that sets the currently clicked field ID.
export const useSetActiveFieldId = () => {
  return useEditorContext().setActiveInlineFieldId;
};

// useSetActiveSection is a custom hook that sets the currently clicked section.
export const useSetActiveSection = () => {
  return useEditorContext().setActiveSection;
};
