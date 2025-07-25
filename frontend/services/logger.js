export async function logClientError(
  location,
  message,
  detail = "",
  severity = "mid"
) {
  try {
    await fetch("http://localhost:3001/api/ERROR_LOGS", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, message, detail, severity }),
    });
  } catch (err) {
    console.error("Logger API çağrısı başarısız:", err);
  }
}
