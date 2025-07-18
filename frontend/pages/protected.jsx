import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Protected() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (!user) return <p>Yönlendiriliyorsunuz...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gizli Alan</h1>
      <p>Hoş geldin, {user.email}!</p>
    </div>
  );
}
