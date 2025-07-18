function formatDateForOracle(dateStr) {
  if (!dateStr) return null;

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    console.warn(`Geçersiz tarih: "${dateStr}"`);
    return null;
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function formatDateTimeForOracle(dateStr) {
  if (!dateStr) return null;

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    console.warn(`Geçersiz tarih/saat formatı: "${dateStr}"`);
    return null;
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

module.exports = { formatDateForOracle, formatDateTimeForOracle };
