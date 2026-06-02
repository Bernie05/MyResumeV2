import React, { createContext, useContext, useState } from "react";
import type {
  OnInlineFieldClickHandler,
  ResumeEditableSection,
  InlineEditableFieldId,
} from "./../components/secret/SecretResumeEditor";

// @/components/secret/SecretResumeEditor

export type OnSectionClick = (section: ResumeEditableSection) => void;

export interface EditorContextValue {
  // Field Level interactions
  onInlineFieldClick?: OnInlineFieldClickHandler;
  activeInlineFieldId: InlineEditableFieldId | null;

  // Section Level interactions
  onSectionClick?: OnSectionClick;
  activeSection: ResumeEditableSection | null;

  // Action
  onAddAction?: (action: string, anchor: HTMLElement) => void;
  onDeleteAction?: (actionId: string) => void;
  isEditMode: boolean;
  onDelete?: () => void;

  // Currently clicked tracking
  setActiveInlineFieldId?: (fieldId: InlineEditableFieldId) => void | null;
  setActiveSection?: (section: ResumeEditableSection) => void | null;
}

// We need to wrap the entire app in this provider to make sure the context is available everywhere
const EditorContext = createContext<EditorContextValue>({
  activeInlineFieldId: null,
  activeSection: null,
  isEditMode: false,
});

export interface EditorProviderProps {
  value?: EditorContextValue | null;
  children: React.ReactNode;
}

/**
 * EditorProvider is a React component that provides the EditorContext to its child components. It takes in a value prop, which should be an object that adheres to the EditorContextValue interface, and a children prop, which represents the child components that will have access to the context. This component is typically used to wrap the entire app or a large portion of it to ensure that the context is available throughout the component tree.
 * @param value - The value to be provided to the context. This should be an object that adheres to the EditorContextValue interface. If null or undefined, default values will be used.
 * @param children - The child components that will have access to the context. This is typically the entire app or a large portion of it.
 * @returns A React component that provides the EditorContext to its child components.
 */
export const EditorProvider = ({ value, children }: EditorProviderProps) => {
  // State to track currently clicked field and section
  const [activeInlineFieldId, setActiveInlineFieldId] =
    useState<InlineEditableFieldId | null>(value?.activeInlineFieldId ?? null);
  const [activeSection, setActiveSection] =
    useState<ResumeEditableSection | null>(value?.activeSection ?? null);

  // Use provided value or fallback to defaults
  const contextValue: EditorContextValue = value
    ? {
        ...value,
        activeInlineFieldId: value.activeInlineFieldId ?? activeInlineFieldId,
        activeSection: value.activeSection ?? activeSection,
        setActiveInlineFieldId,
        setActiveSection,
      }
    : {
        activeInlineFieldId,
        activeSection,
        isEditMode: false,
        setActiveInlineFieldId,
        setActiveSection,
      };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

/**
 * useEditor is a custom React hook that allows components to access the EditorContext. It uses the useContext hook to retrieve the current value of the EditorContext and returns it. If the context is not available (i.e., if the component using this hook is not wrapped in an EditorProvider), it will return the default context value. This hook provides a convenient way for components to access the editor-related state and functions defined in the context.
 * @returns The current value of the EditorContext, which should be an object adhering to the EditorContextValue interface.
 */
export const useEditor = (): EditorContextValue => {
  return useContext(EditorContext);
};
