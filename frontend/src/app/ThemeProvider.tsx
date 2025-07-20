"use client";

import React, { createContext, useState, useEffect } from "react";
import { themes, Theme } from "./themes";

export const ThemeContext = createContext<{
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
}>({
  theme: null,
  setTheme: () => {},
});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Only run on client
    const idx = Math.floor(Math.random() * themes.length);
    setTheme(themes[idx]);
  }, []);

  if (!theme) {
    // Optionally, render a loading spinner or just null until theme is set
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        style={{
          minHeight: "100vh",
          // Split background into color and image for longhand properties
          ...(() => {
            // Try to extract color and image from theme.background
            const bg = theme.background;
            const colorMatch = bg.match(/(#[0-9a-fA-F]{3,6}|rgba?\([^)]*\)|[a-zA-Z]+)\s*(,|$)/);
            const imageMatch = bg.match(/url\([^)]+\)/);
            return {
              backgroundColor: colorMatch ? colorMatch[1] : undefined,
              backgroundImage: imageMatch ? imageMatch[0] : undefined,
              backgroundRepeat: imageMatch ? "repeat" : undefined,
              backgroundPosition: imageMatch ? "center" : undefined,
              backgroundSize: imageMatch ? "auto auto" : undefined,
              transition: "background 0.5s",
            };
          })(),
        }}
      >
          {children}
      </div>
    </ThemeContext.Provider>
  );
} 