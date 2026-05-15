import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  ResumeData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  CertificationItem,
  ProjectItem,
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
  },
});

export const {
  loadResumeDataStart,
  loadResumeDataSuccess,
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
} = resumeDataSlice.actions;

export default resumeDataSlice.reducer;
