"use client";

import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import { themes } from "./themes";

export default function ThemeSwitchButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  function switchTheme() {
    if (!theme) return;
    if (themes.length < 2) return; // No alternative theme
    let idx = Math.floor(Math.random() * (themes.length - 1));
    // If the random index is at or after the current theme, skip over it
    const currentIdx = themes.indexOf(theme);
    if (idx >= currentIdx) idx++;
    setTheme(themes[idx]);
  }

  return (
    <button
      onClick={switchTheme}
      aria-label="Change Theme"
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 10,
        width: 40,
        height: 40,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <img
        src="/question-block.svg"
        alt="Change Theme"
        width={40}
        height={40}
        style={{ display: "block" }}
      />
    </button>
  );
} 