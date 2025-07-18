import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function useAuthRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { pathname } = router;

    const protectedPaths = ["/admin", "/protected"];
    if (!user && protectedPaths.includes(pathname)) {
      router.replace("/login");
      return;
    }

    if (user) {
      if (pathname === "/admin" && user.userType !== "yonetmen") {
        router.replace("/");
      }
      if (pathname === "/protected" && user.userType !== "oyuncu") {
        router.replace("/");
      }
    }
  }, [user, router]);
}
