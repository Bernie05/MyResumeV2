import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    photoUrl: string;
    backgroundUrl: string;
    summary: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    duration: string;
    location: string;
    description: string[];
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    field: string;
    year: string;
    location: string;
  }>;
  skills: Array<{
    category: string;
    items: Array<{ name: string; proficiency: number }>;
  }>;
  certifications: Array<{
    id: number;
    name: string;
    issuer: string;
    year: string;
  }>;
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
}

interface ResumeState {
  data: ResumeData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  data: null,
  loading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setResumeData: (state, action: PayloadAction<ResumeData>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setResumeData, setError } = resumeSlice.actions;
export default resumeSlice.reducer;
