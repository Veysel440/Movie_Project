import "../styles/globals.css";
import "../styles/auth.css";
import "../styles/admin.module.css";

import { AuthProvider } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";
import useAuthRedirect from "../hooks/useAuthRedirect";
import Header from "../components/layout/Header";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const { darkTheme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <AuthProvider>
      <AppContent
        darkTheme={darkTheme}
        toggleTheme={toggleTheme}
        router={router}
        Component={Component}
        pageProps={pageProps}
      />
    </AuthProvider>
  );
}

function AppContent({ darkTheme, toggleTheme, router, Component, pageProps }) {
  useAuthRedirect();

  const isAdminPage = router.pathname === "/admin";

  return (
    <>
      {/* Admin sayfasında Header gösterilmez */}
      {!isAdminPage && (
        <Header darkTheme={darkTheme} toggleTheme={toggleTheme} />
      )}
      <Component {...pageProps} />
    </>
  );
}
