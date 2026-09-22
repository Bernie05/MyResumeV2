import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ResumeData } from "@/types/resume";

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
  markAsSaved,
  clearResumeData,
  resetToBaseline,
  discardChanges,
} = resumeDataSlice.actions;

export default resumeDataSlice.reducer;
