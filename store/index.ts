import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import resumeDataReducer from "./slices/resumeDataSlice";

// persistReducer wraps the resumeData slice reducer directly (not a combined
// root reducer), so only this slice is ever persisted — `auth` is excluded
// simply by not being wrapped. A `whitelist` option here would be a no-op
// since whitelisting only applies when persisting a combined reducer.
const persistConfig = {
  key: "resume-editor",
  storage: storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, resumeDataReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
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
