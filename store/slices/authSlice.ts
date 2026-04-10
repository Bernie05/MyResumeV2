import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthStatus = "idle" | "submitting" | "authenticated" | "error";

interface AuthState {
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.status = "idle";
      state.error = null;
    },
    signInStarted: (state) => {
      state.status = "submitting";
      state.error = null;
    },
    signInSucceeded: (state) => {
      state.status = "authenticated";
      state.error = null;
    },
    signInFailed: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
  },
});

export const { clearAuthState, signInStarted, signInSucceeded, signInFailed } =
  authSlice.actions;

export default authSlice.reducer;
