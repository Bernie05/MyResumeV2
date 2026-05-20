import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import type { RootState } from "@/store";
import type { ResumeData } from "@/types/resume";
import {
  updatePersonalInfo,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addProject,
  updateProject,
  deleteProject,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  addPortfolioResult,
  updatePortfolioResult,
  deletePortfolioResult,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  addCustomStat,
  updateCustomStat,
  deleteCustomStat,
  updateStatsField,
  addExperienceBullet,
  updateExperienceBullet,
  deleteExperienceBullet,
  markAsSaved,
  resetToBaseline,
  discardChanges,
  loadResumeDataSuccess,
} from "@/store/slices/resumeDataSlice";

/**
 * Custom hook to manage resume data editing with Redux backend.
 * Provides a setDraft-like interface while using Redux for state management.
 */
export const useResumeEditor = () => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.resumeData.data);
  const hasChanges = useSelector(
    (state: RootState) => state.resumeData.hasChanges,
  );

  // Wrapper function that mimics setDraft behavior
  const setDraft = useCallback(
    (updater: (current: ResumeData) => ResumeData) => {
      if (draft) {
        const updated = updater(draft);
        dispatch(loadResumeDataSuccess(updated));
      }
    },
    [draft, dispatch],
  );

  // Safe draft access with null checks
  const safeDraft = draft || {
    personalInfo: {},
    experience: [],
    education: [],
    projects: [],
    portfolio: [],
    certifications: [],
    skills: [],
    stats: {},
  };

  return {
    draft: safeDraft,
    setDraft,
    hasChanges,
    // Redux actions
    dispatch,
    // Action creators
    updatePersonalInfo,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addProject,
    updateProject,
    deleteProject,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    addPortfolioResult,
    updatePortfolioResult,
    deletePortfolioResult,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    addCustomStat,
    updateCustomStat,
    deleteCustomStat,
    updateStatsField,
    addExperienceBullet,
    updateExperienceBullet,
    deleteExperienceBullet,
    markAsSaved,
    resetToBaseline,
    discardChanges,
    loadResumeDataSuccess,
  };
};
