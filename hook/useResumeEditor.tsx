import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { ResumeData } from "@/types/resume";
import {
  replaceResumeDraft,
} from "@/store/slices/resumeDataSlice";

const EMPTY_RESUME_DATA: ResumeData = {
  personalInfo: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    photoUrl: "",
    backgroundUrl: "",
    summary: "",
    website: "",
    linkedin: "",
    github: "",
    hireButtonText: "",
    downloadButtonText: "",
    social: [],
  },
  socialMedia: [],
  stats: {
    yearsExperience: 0,
    projects: 0,
    clients: 0,
    awards: 0,
    custom: [],
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  portfolio: [],
  servicesTitle: "",
  servicesSubtitle: "",
};

/**
 * Custom hook to manage resume data editing with Redux backend.
 * Provides a setDraft-like interface while using Redux for state management.
 */
export const useResumeEditor = () => {
  const dispatch = useAppDispatch();
  const storedDraft = useAppSelector((state) => state.resumeData.data);
  const hasChanges = useAppSelector((state) => state.resumeData.hasChanges);
  const hasDraft = Boolean(storedDraft);

  // Wrapper function that mimics setDraft behavior
  const setDraft = useCallback(
    (updater: (current: ResumeData) => ResumeData) => {
      if (!storedDraft) {
        return;
      }

      dispatch(replaceResumeDraft(updater(storedDraft)));
    },
    [storedDraft, dispatch],
  );

  return {
    draft: storedDraft ?? EMPTY_RESUME_DATA,
    hasDraft,
    setDraft,
    hasChanges,
  };
};
