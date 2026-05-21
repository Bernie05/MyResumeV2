import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  ResumeData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  CertificationItem,
  ProjectItem,
  PortfolioItem,
  ResumeStats,
  SocialMediaLink,
} from "@/types/resume";

interface ResumeDataState {
  data: ResumeData | null;
  isLoading: boolean;
  error: string | null;
  hasChanges: boolean;
  lastSaved: string | null;
}

const initialState: ResumeDataState = {
  data: null,
  isLoading: false,
  error: null,
  hasChanges: false,
  lastSaved: null,
};

const resumeDataSlice = createSlice({
  name: "resumeData",
  initialState,
  reducers: {
    // Load data
    loadResumeDataStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadResumeDataSuccess: (state, action: PayloadAction<ResumeData>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
      state.hasChanges = false;
    },
    replaceResumeDraft: (state, action: PayloadAction<ResumeData>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
      state.hasChanges = true;
    },
    loadResumeDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update personal info
    updatePersonalInfo: (
      state,
      action: PayloadAction<Partial<PersonalInfo>>,
    ) => {
      if (state.data) {
        state.data.personalInfo = {
          ...state.data.personalInfo,
          ...action.payload,
        };
        state.hasChanges = true;
      }
    },

    // Experience operations
    addExperience: (state, action: PayloadAction<ExperienceItem>) => {
      if (state.data) {
        state.data.experience.push(action.payload);
        state.hasChanges = true;
      }
    },
    updateExperience: (
      state,
      action: PayloadAction<{ id: number; updates: Partial<ExperienceItem> }>,
    ) => {
      if (state.data) {
        const index = state.data.experience.findIndex(
          (exp) => exp.id === action.payload.id,
        );
        if (index !== -1) {
          state.data.experience[index] = {
            ...state.data.experience[index],
            ...action.payload.updates,
          };
          state.hasChanges = true;
        }
      }
    },
    deleteExperience: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.experience = state.data.experience.filter(
          (exp) => exp.id !== action.payload,
        );
        state.hasChanges = true;
      }
    },

    // Education operations
    addEducation: (state, action: PayloadAction<EducationItem>) => {
      if (state.data) {
        state.data.education.push(action.payload);
        state.hasChanges = true;
      }
    },
    updateEducation: (
      state,
      action: PayloadAction<{ id: number; updates: Partial<EducationItem> }>,
    ) => {
      if (state.data) {
        const index = state.data.education.findIndex(
          (edu) => edu.id === action.payload.id,
        );
        if (index !== -1) {
          state.data.education[index] = {
            ...state.data.education[index],
            ...action.payload.updates,
          };
          state.hasChanges = true;
        }
      }
    },
    deleteEducation: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.education = state.data.education.filter(
          (edu) => edu.id !== action.payload,
        );
        state.hasChanges = true;
      }
    },

    // Skills operations
    updateSkills: (state, action: PayloadAction<SkillCategory[]>) => {
      if (state.data) {
        state.data.skills = action.payload;
        state.hasChanges = true;
      }
    },
    addSkillCategory: (state, action: PayloadAction<SkillCategory>) => {
      if (state.data) {
        state.data.skills.push(action.payload);
        state.hasChanges = true;
      }
    },

    // Certifications operations
    addCertification: (state, action: PayloadAction<CertificationItem>) => {
      if (state.data) {
        state.data.certifications.push(action.payload);
        state.hasChanges = true;
      }
    },
    updateCertification: (
      state,
      action: PayloadAction<{
        id: number;
        updates: Partial<CertificationItem>;
      }>,
    ) => {
      if (state.data) {
        const index = state.data.certifications.findIndex(
          (cert) => cert.id === action.payload.id,
        );
        if (index !== -1) {
          state.data.certifications[index] = {
            ...state.data.certifications[index],
            ...action.payload.updates,
          };
          state.hasChanges = true;
        }
      }
    },
    deleteCertification: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.certifications = state.data.certifications.filter(
          (cert) => cert.id !== action.payload,
        );
        state.hasChanges = true;
      }
    },

    // Projects operations
    addProject: (state, action: PayloadAction<ProjectItem>) => {
      if (state.data) {
        state.data.projects.push(action.payload);
        state.hasChanges = true;
      }
    },
    updateProject: (
      state,
      action: PayloadAction<{ id: number; updates: Partial<ProjectItem> }>,
    ) => {
      if (state.data) {
        const index = state.data.projects.findIndex(
          (proj) => proj.id === action.payload.id,
        );
        if (index !== -1) {
          state.data.projects[index] = {
            ...state.data.projects[index],
            ...action.payload.updates,
          };
          state.hasChanges = true;
        }
      }
    },
    deleteProject: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.projects = state.data.projects.filter(
          (proj) => proj.id !== action.payload,
        );
        state.hasChanges = true;
      }
    },

    // Save operations
    markAsSaved: (state) => {
      state.hasChanges = false;
      state.lastSaved = new Date().toISOString();
    },
    clearResumeData: (state) => {
      state.data = null;
      state.hasChanges = false;
      state.error = null;
    },

    // Experience bullet operations
    addExperienceBullet: (
      state,
      action: PayloadAction<{ experienceIndex: number; bullet: string }>,
    ) => {
      if (state.data) {
        const exp = state.data.experience[action.payload.experienceIndex];
        if (exp) {
          exp.description.push(action.payload.bullet);
          state.hasChanges = true;
        }
      }
    },
    updateExperienceBullet: (
      state,
      action: PayloadAction<{
        experienceIndex: number;
        bulletIndex: number;
        bullet: string;
      }>,
    ) => {
      if (state.data) {
        const exp = state.data.experience[action.payload.experienceIndex];
        if (exp && exp.description[action.payload.bulletIndex] !== undefined) {
          exp.description[action.payload.bulletIndex] = action.payload.bullet;
          state.hasChanges = true;
        }
      }
    },
    deleteExperienceBullet: (
      state,
      action: PayloadAction<{ experienceIndex: number; bulletIndex: number }>,
    ) => {
      if (state.data) {
        const exp = state.data.experience[action.payload.experienceIndex];
        if (exp) {
          exp.description.splice(action.payload.bulletIndex, 1);
          state.hasChanges = true;
        }
      }
    },

    // Portfolio operations
    addPortfolioItem: (state, action: PayloadAction<PortfolioItem>) => {
      if (state.data) {
        state.data.portfolio.push(action.payload);
        state.hasChanges = true;
      }
    },
    updatePortfolioItem: (
      state,
      action: PayloadAction<{ index: number; updates: Partial<PortfolioItem> }>,
    ) => {
      if (state.data && state.data.portfolio[action.payload.index]) {
        state.data.portfolio[action.payload.index] = {
          ...state.data.portfolio[action.payload.index],
          ...action.payload.updates,
        };
        state.hasChanges = true;
      }
    },
    deletePortfolioItem: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.portfolio.splice(action.payload, 1);
        state.hasChanges = true;
      }
    },
    addPortfolioResult: (
      state,
      action: PayloadAction<{ portfolioIndex: number; result: string }>,
    ) => {
      if (state.data) {
        const item = state.data.portfolio[action.payload.portfolioIndex];
        if (item) {
          item.results.push(action.payload.result);
          state.hasChanges = true;
        }
      }
    },
    updatePortfolioResult: (
      state,
      action: PayloadAction<{
        portfolioIndex: number;
        resultIndex: number;
        result: string;
      }>,
    ) => {
      if (state.data) {
        const item = state.data.portfolio[action.payload.portfolioIndex];
        if (item && item.results[action.payload.resultIndex] !== undefined) {
          item.results[action.payload.resultIndex] = action.payload.result;
          state.hasChanges = true;
        }
      }
    },
    deletePortfolioResult: (
      state,
      action: PayloadAction<{ portfolioIndex: number; resultIndex: number }>,
    ) => {
      if (state.data) {
        const item = state.data.portfolio[action.payload.portfolioIndex];
        if (item) {
          item.results.splice(action.payload.resultIndex, 1);
          state.hasChanges = true;
        }
      }
    },

    // Social links operations
    addSocialLink: (state, action: PayloadAction<SocialMediaLink>) => {
      if (state.data) {
        if (!state.data.socialMedia) {
          state.data.socialMedia = [];
        }
        state.data.socialMedia.push(action.payload);
        state.hasChanges = true;
      }
    },
    updateSocialLink: (
      state,
      action: PayloadAction<{
        index: number;
        updates: Partial<SocialMediaLink>;
      }>,
    ) => {
      if (state.data && state.data.socialMedia) {
        const link = state.data.socialMedia[action.payload.index];
        if (link) {
          Object.assign(link, action.payload.updates);
          state.hasChanges = true;
        }
      }
    },
    deleteSocialLink: (state, action: PayloadAction<number>) => {
      if (state.data && state.data.socialMedia) {
        state.data.socialMedia.splice(action.payload, 1);
        state.hasChanges = true;
      }
    },

    // Custom stats operations
    addCustomStat: (
      state,
      action: PayloadAction<{ label: string; value: number; suffix?: string }>,
    ) => {
      if (state.data) {
        if (!state.data.stats.custom) {
          state.data.stats.custom = [];
        }
        state.data.stats.custom.push(action.payload);
        state.hasChanges = true;
      }
    },
    updateCustomStat: (
      state,
      action: PayloadAction<{
        index: number;
        updates: { label?: string; value?: number; suffix?: string };
      }>,
    ) => {
      if (state.data && state.data.stats.custom) {
        const stat = state.data.stats.custom[action.payload.index];
        if (stat) {
          Object.assign(stat, action.payload.updates);
          state.hasChanges = true;
        }
      }
    },
    deleteCustomStat: (state, action: PayloadAction<number>) => {
      if (state.data && state.data.stats.custom) {
        state.data.stats.custom.splice(action.payload, 1);
        state.hasChanges = true;
      }
    },

    // Update stats field
    updateStatsField: (
      state,
      action: PayloadAction<{
        field: keyof ResumeStats;
        value: ResumeStats[keyof ResumeStats];
      }>,
    ) => {
      if (state.data) {
        state.data.stats = {
          ...state.data.stats,
          [action.payload.field]: action.payload.value,
        };
        state.hasChanges = true;
      }
    },

    // Reset to baseline
    resetToBaseline: (state, action: PayloadAction<ResumeData>) => {
      state.data = action.payload;
      state.hasChanges = false;
      state.error = null;
    },

    // Discard changes
    discardChanges: (state, action: PayloadAction<ResumeData>) => {
      state.data = action.payload;
      state.hasChanges = false;
    },
  },
});

export const {
  loadResumeDataStart,
  loadResumeDataSuccess,
  replaceResumeDraft,
  loadResumeDataFailure,
  updatePersonalInfo,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  updateSkills,
  addSkillCategory,
  addCertification,
  updateCertification,
  deleteCertification,
  addProject,
  updateProject,
  deleteProject,
  markAsSaved,
  clearResumeData,
  addExperienceBullet,
  updateExperienceBullet,
  deleteExperienceBullet,
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
  resetToBaseline,
  discardChanges,
} = resumeDataSlice.actions;

export default resumeDataSlice.reducer;
