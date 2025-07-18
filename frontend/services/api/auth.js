// 1) LOGIN
export async function login(email, password) {
  const res = await fetch("http://localhost:3002/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || "Giriş başarısız.");
  }
  return data.user;
}

// 2) REGISTER (endpoint'in portu ayrı, kendi backend'ine göre ayarla)
export async function register(form) {
  const res = await fetch("http://localhost:3005/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Kayıt başarısız");
  return { email: form.email, userType: form.userType };
}

// 3) ME (Girişli kullanıcıyı döner)
export async function me() {
  const res = await fetch("http://localhost:3002/api/auth/me", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Yetki yok");
  const data = await res.json();
  return data.user;
}

// 4) LOGOUT
export async function logout() {
  await fetch("http://localhost:3002/api/auth/logout", {
    credentials: "include",
    method: "POST",
  });
}
