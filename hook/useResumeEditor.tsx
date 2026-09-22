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
    dateOfBirth: "",
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
  services: [],
  certifications: [],
  projects: [],
  portfolio: [],
  testimonials: [],
  characterReferences: [],
  declaration: "",
  servicesBadge: "",
  servicesTitle: "",
  servicesSubtitle: "",
  experienceBadge: "",
  experienceTitle: "",
  portfolioBadge: "",
  portfolioTitle: "",
  portfolioSubtitle: "",
  projectsBadge: "",
  projectsTitle: "",
  projectsSubtitle: "",
  educationBadge: "",
  educationTitle: "",
  skillsBadge: "",
  skillsTitle: "",
  skillsSubtitle: "",
  certificationsBadge: "",
  certificationsTitle: "",
  testimonialsBadge: "",
  testimonialsTitle: "",
  characterReferencesBadge: "",
  characterReferencesTitle: "",
  contactBadge: "",
  contactTitle: "",
  contactSubtitle: "",
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

  // Merge over EMPTY_RESUME_DATA so a draft persisted (via redux-persist/localStorage)
  // before a newer field was added to ResumeData doesn't crash consumers that assume
  // every field is present (e.g. `draft.testimonials.map(...)`).
  const draft = storedDraft
    ? { ...EMPTY_RESUME_DATA, ...storedDraft }
    : EMPTY_RESUME_DATA;

  // Wrapper function that mimics setDraft behavior. Passes the merged `draft`
  // (not the raw, possibly-stale `storedDraft`) to the updater so callers in
  // SecretResumeEditor.tsx can safely spread/iterate any field — including
  // ones added after this browser's localStorage was last persisted.
  const setDraft = useCallback(
    (updater: (current: ResumeData) => ResumeData) => {
      if (!storedDraft) {
        return;
      }

      dispatch(replaceResumeDraft(updater(draft)));
    },
    [storedDraft, draft, dispatch],
  );

  return {
    draft,
    hasDraft,
    setDraft,
    hasChanges,
  };
};
