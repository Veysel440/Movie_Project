import { logClientError } from "../../services/logger";

export default function ThemeToggle({ darkTheme, toggleTheme }) {
  const handleClick = () => {
    try {
      if (typeof toggleTheme !== "function") {
        throw new Error("toggleTheme fonksiyonu eksik");
      }
      toggleTheme();
    } catch (err) {
      logClientError("ThemeToggle", "Tema değiştirilemedi", err.message, "low");
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleClick}
      title="Tema değiştir"
      aria-label="Tema değiştir"
    >
      {darkTheme ? "🌞" : "🌙"}
    </button>
  );
}
