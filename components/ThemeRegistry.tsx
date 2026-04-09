"use client";

import React, { useState, ReactNode } from "react";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";

export type ThemeRegistry = {
  children: ReactNode;
};

const ThemeRegistry = ({ children }: ThemeRegistry) => {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      inserted.push(args[1] as unknown as string);
      return prevInsert(...args);
    };
    const flush = () => inserted;
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const inserted = flush();
    if (inserted.length === 0) {
      return null;
    }
    return (
      <style
        key="emotion-server-side-rendering"
        dangerouslySetInnerHTML={{
          __html: inserted.join(" "),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

export default ThemeRegistry;
