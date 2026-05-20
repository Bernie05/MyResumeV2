"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import { store, persistor } from "@/store";
import { ThemeContextProvider } from "@/context/ThemeContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeContextProvider>{children}</ThemeContextProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
};

export default Providers;
