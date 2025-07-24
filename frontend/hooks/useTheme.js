import { useState, useEffect } from "react";
import { logClientError } from "../services/logger";

export default function useTheme() {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    try {
      if (darkTheme) {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }
    } catch (err) {
      logClientError("useTheme", "Tema değiştirilemedi", err?.message, "low");
    }
  }, [darkTheme]);

  const toggleTheme = () => setDarkTheme((prev) => !prev);

  return { darkTheme, toggleTheme };
}
