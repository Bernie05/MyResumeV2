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
  testimonials: [],
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

  // Merge over EMPTY_RESUME_DATA so a draft persisted (via redux-persist/localStorage)
  // before a newer field was added to ResumeData doesn't crash consumers that assume
  // every field is present (e.g. `draft.testimonials.map(...)`).
  const draft = storedDraft
    ? { ...EMPTY_RESUME_DATA, ...storedDraft }
    : EMPTY_RESUME_DATA;

  return {
    draft,
    hasDraft,
    setDraft,
    hasChanges,
  };
};
