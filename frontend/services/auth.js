export async function loginUser(email, password) {
  const response = await fetch("http://localhost:3002/api/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Giriş başarısız.");
  return data;
}

export async function checkAuth() {
  const response = await fetch("http://localhost:3002/api/protected", {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Yetkisiz.");
  return data;
}
