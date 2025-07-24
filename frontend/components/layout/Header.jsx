import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { logClientError } from "../../services/logger";

export default function Header({ darkTheme, toggleTheme }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    try {
      if (typeof logout !== "function") {
        throw new Error("logout fonksiyonu tanımsız");
      }
      logout();
    } catch (err) {
      logClientError("Header", "Çıkış işlemi hatası", err.message, "mid");
    }
  };

  return (
    <header>
      <div className="logo">Film Projesi</div>
      <nav>
        <Link href="/">Anasayfa</Link>
        <Link href="/movies">Filmler</Link>
        <Link href="/series">Diziler</Link>
        <ThemeToggle darkTheme={darkTheme} toggleTheme={toggleTheme} />

        {user ? (
          <>
            <span style={{ marginLeft: "10px" }}>Merhaba, {user.email}</span>
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Giriş Yap</Link>
            <Link href="/register">Kayıt Ol</Link>
          </>
        )}
      </nav>
    </header>
  );
}
