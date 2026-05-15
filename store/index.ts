import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import resumeReducer from "./slices/resumeSlice";
import resumeDataReducer from "./slices/resumeDataSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    resumeData: resumeDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
