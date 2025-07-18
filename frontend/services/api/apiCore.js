import { normalizeData } from "../../utils/helpers";
import Cookies from "js-cookie";

const API_ENDPOINTS = {
  register: "http://localhost:3003/api",
  default: "http://localhost:3001/api",
};

export const apiRequest = async (
  endpoint,
  method = "GET",
  data = null,
  setLoading = null,
  endpointType = "default"
) => {
  const baseUrl = API_ENDPOINTS[endpointType] || API_ENDPOINTS.default;
  if (setLoading) setLoading(true);

  const token = Cookies.get("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const res = await fetch(`${baseUrl}/${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    });

    const text = await res.text();
    let responseData = {};
    try {
      responseData = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Sunucudan geçersiz JSON: ${text}`);
    }

    if (!res.ok) throw new Error(responseData.error || "API isteği başarısız.");
    return responseData.data || responseData;
  } catch (err) {
    console.error(`API Hatası (${method} ${endpoint}):`, err.message);
    throw err;
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const prepareId = (item, idKey) => {
  const keys = Array.isArray(idKey) ? idKey : [idKey];
  const parts = keys.map((k) =>
    encodeURIComponent(item[k.toUpperCase()] || "")
  );
  return parts.join("/");
};

export const getTableColumns = (tableName) => {
  const config = {
    movies: ["ID", "TITLE", "LINK", "POSTER", "DESCRIPTION"],
    users: ["EMAIL", "NAME", "SURNAME", "USER_TYPE", "PASSWORD"],
    series: ["ID", "TITLE", "LINK", "POSTER", "DESCRIPTION"],
    comments: ["USEREMAIL", "COMMENT", "RATING", "CREATEDAT"],
  };
  return config[tableName.toLowerCase()] || [];
};
