import { apiRequest, prepareId } from "./apiCore";
import { getIdKey, normalizeData } from "../../utils/helpers";

export const fetchData = async (table, setData, setError, setLoading) => {
  try {
    let endpoint = table.toLowerCase();
    if (table === "MOVIE_RATINGS_COMMENTS") {
      endpoint = "comments?status=pending";
    }

    const raw = await apiRequest(endpoint, "GET", null, setLoading);
    setData(raw.map((item) => normalizeData(item, table)));
    setError("");
  } catch (err) {
    setError(err.message || "Veri alınamadı");
  }
};

export const handleAdd = async (
  newItem,
  activeTab,
  setNewItem,
  closeModal,
  fetchData,
  setError
) => {
  try {
    const normalized = normalizeData(newItem, activeTab);
    await apiRequest(activeTab.toLowerCase(), "POST", normalized);
    alert("Ekleme başarılı");
    setNewItem({});
    closeModal(false);
    fetchData(activeTab);
    setError("");
  } catch (err) {
    setError(`Ekleme başarısız. Detay: ${err.message}`);
  }
};

export const handleUpdate = async (
  editItem,
  activeTab,
  setEditItem,
  closeModal,
  fetchData,
  setError
) => {
  if (!editItem) return;

  try {
    const id = prepareId(editItem, getIdKey(activeTab));
    if (!id) {
      setError("Geçerli ID bulunamadı.");
      return;
    }
    const normalized = normalizeData(editItem, activeTab);
    await apiRequest(`${activeTab.toLowerCase()}/${id}`, "PUT", normalized);
    alert("Güncelleme başarılı");
    setEditItem(null);
    closeModal(false);
    fetchData(activeTab);
    setError("");
  } catch (err) {
    setError(`Güncelleme başarısız. Detay: ${err.message}`);
  }
};

export const handleDelete = async (item, activeTab, fetchData, setError) => {
  if (!window.confirm("Silmek istediğinizden emin misiniz?")) return;
  try {
    const id = prepareId(item, getIdKey(activeTab));
    await apiRequest(`${activeTab.toLowerCase()}/${id}`, "DELETE");
    alert("Silme başarılı");
    fetchData(activeTab);
    setError("");
  } catch (err) {
    setError(`Silme başarısız. Detay: ${err.message}`);
  }
};

export const approveComment = async (commentId, fetchData, setError) => {
  try {
    await apiRequest(`comments/${commentId}`, "PUT", { status: "approved" });
    alert("Yorum onaylandı");
    fetchData("MOVIE_RATINGS_COMMENTS");
    setError("");
  } catch (err) {
    setError(`Onaylama başarısız. Detay: ${err.message}`);
  }
};

export const truncateDescription = (text, maxLength) => {
  if (!text) return "";
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
};
