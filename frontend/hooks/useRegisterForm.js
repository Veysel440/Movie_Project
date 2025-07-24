import { useState } from "react";
import { logClientError } from "../services/logger";

export default function useRegisterForm() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [userType, setUserType] = useState("oyuncu");
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setUserType("oyuncu");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirm) {
      setErrorMessage("Parolalar eşleşmiyor!");
      logClientError(
        "useRegisterForm",
        "Parola eşleşmiyor",
        `${email} - ${name} - ${surname}`,
        "low"
      );
      return;
    }

    const userData = { name, surname, email, password, userType };

    try {
      const response = await fetch("http://localhost:3003/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const text = await response.text();

      if (!response.ok) {
        const errorData = JSON.parse(text);
        logClientError(
          "useRegisterForm",
          "Kayıt API hatası",
          errorData.error || "Sunucu hatası",
          "high"
        );
        throw new Error(errorData.error || "Sunucu hatası");
      }

      const data = JSON.parse(text);
      alert(data.message || "Kayıt başarılı");
      resetForm();
    } catch (error) {
      setErrorMessage(
        error.message === "Failed to fetch"
          ? "Sunucuya bağlanılamadı. Backend portu (3003) açık mı?"
          : error.message
      );
      logClientError(
        "useRegisterForm",
        "Kayıt submit hatası",
        error?.message,
        "high"
      );
    }
  };

  return {
    name,
    surname,
    email,
    password,
    confirm,
    userType,
    errorMessage,
    setName,
    setSurname,
    setEmail,
    setPassword,
    setConfirm,
    setUserType,
    handleSubmit,
  };
}
