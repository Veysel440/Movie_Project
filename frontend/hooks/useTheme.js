import { useEffect, useState } from "react";

export default function useTheme() {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkTheme]);

  const toggleTheme = () => setDarkTheme((prev) => !prev);

  return { darkTheme, toggleTheme };
}
