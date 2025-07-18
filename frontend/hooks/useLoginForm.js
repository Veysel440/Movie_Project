import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Giriş başarısız");
        return;
      }

      setUser(data.user);

      if (data.user.userType === "yonetmen") {
        router.push("/admin");
      } else if (data.user.userType === "oyuncu") {
        router.push("/protected");
      } else {
        setErrorMessage("Bilinmeyen kullanıcı tipi");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Sunucuya bağlanılamadı.");
    }
  };

  return { email, setEmail, password, setPassword, errorMessage, handleSubmit };
}
