"use client";

import { useEffect, useState } from "react";

export type ThemeId = "spartan" | "sokin";
const KEY = "spartan:theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>("spartan");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as ThemeId) || "spartan";
    setThemeState(saved);
    setLoaded(true);
  }, []);

  function setTheme(next: ThemeId) {
    setThemeState(next);
    localStorage.setItem(KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return { theme, setTheme, loaded };
}
