import { logClientError } from "../logger";

export async function login(email, password) {
  try {
    const res = await fetch("http://localhost:3002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!data.success) {
      logClientError(
        "login",
        "Kullanıcı girişi başarısız",
        data.message,
        "high"
      );
      throw new Error(data.message || "Giriş başarısız.");
    }
    return data.user;
  } catch (err) {
    logClientError("login", "Login fetch hatası", err.message, "high");
    throw err;
  }
}

export async function register(form) {
  try {
    const res = await fetch("http://localhost:3005/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!data.success) {
      logClientError(
        "register",
        "Kullanıcı kaydı başarısız",
        data.error,
        "high"
      );
      throw new Error(data.error || "Kayıt başarısız");
    }
    return { email: form.email, userType: form.userType };
  } catch (err) {
    logClientError("register", "Register fetch hatası", err.message, "high");
    throw err;
  }
}

export async function me() {
  try {
    const res = await fetch("http://localhost:3002/api/auth/me", {
      credentials: "include",
    });
    if (!res.ok) {
      logClientError(
        "me",
        "Kullanıcı yetki doğrulama başarısız",
        "HTTP Status: " + res.status,
        "mid"
      );
      throw new Error("Yetki yok");
    }
    const data = await res.json();
    return data.user;
  } catch (err) {
    logClientError("me", "Me fetch hatası", err.message, "mid");
    throw err;
  }
}

export async function logout() {
  try {
    await fetch("http://localhost:3002/api/auth/logout", {
      credentials: "include",
      method: "POST",
    });
  } catch (err) {
    logClientError("logout", "Logout fetch hatası", err.message, "low");
  }
}
