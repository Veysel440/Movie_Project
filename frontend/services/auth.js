import { logClientError } from "../logger";

export async function loginUser(email, password) {
  try {
    const response = await fetch("http://localhost:3002/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      logClientError(
        "loginUser",
        "Kullanıcı girişi API hatası",
        data.message || "Giriş başarısız.",
        "high"
      );
      throw new Error(data.message || "Giriş başarısız.");
    }
    return data;
  } catch (err) {
    logClientError("loginUser", "Login fetch hatası", err?.message, "high");
    throw err;
  }
}

export async function checkAuth() {
  try {
    const response = await fetch("http://localhost:3002/api/protected", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      logClientError(
        "checkAuth",
        "Kullanıcı doğrulama API hatası",
        data.message || "Yetkisiz.",
        "high"
      );
      throw new Error(data.message || "Yetkisiz.");
    }
    return data;
  } catch (err) {
    logClientError(
      "checkAuth",
      "Auth kontrol fetch hatası",
      err?.message,
      "high"
    );
    throw err;
  }
}
