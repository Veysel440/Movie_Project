export default function ThemeToggle({ darkTheme, toggleTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title="Tema değiştir"
      aria-label="Tema değiştir"
    >
      {darkTheme ? "🌞" : "🌙"}
    </button>
  );
}
