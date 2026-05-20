import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import resumeReducer from "./slices/resumeSlice";
import resumeDataReducer from "./slices/resumeDataSlice";

const persistConfig = {
  key: "resume-editor",
  storage: storage,
  whitelist: ["resumeData"], // Only persist resumeData slice
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, resumeDataReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    resumeData: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
