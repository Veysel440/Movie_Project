import { useState, useEffect } from "react";
import styles from "../styles/admin.module.css";
import { getTableColumns, validateData } from "../utils/helpers/tableHelpers";
import { validateEmail } from "../utils/helpers/validationHelpers";

export default function Modal({
  isOpen,
  onClose,
  title,
  item,
  setItem,
  activeTab,
  onSave,
  setError: setParentError,
  inputTypes = {},
}) {
  const [error, setError] = useState("");
  const [localItem, setLocalItem] = useState({});

  useEffect(() => {
    setLocalItem(item || {});
    if (setParentError) setParentError(error);
  }, [item, error, setParentError]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...localItem, [name]: value };
    setLocalItem(updated);
    setItem(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!localItem || Object.keys(localItem).length === 0) {
      setError("Form boş olamaz.");
      return;
    }

    const columns = getTableColumns(activeTab);

    const validation = validateData(localItem, activeTab);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    const processedItem = { ...localItem };

    const passwordKey = columns.find((col) => col.toUpperCase() === "PASSWORD");
    if (passwordKey) {
      const passwordValue = processedItem[passwordKey] || "";
      if (passwordValue.trim() === "") {
        delete processedItem[passwordKey];
      }
    }

    if (onSave) {
      onSave(processedItem);
      setError("");
    } else {
      setError("Kaydetme işlemi yok.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <form onSubmit={handleSubmit}>
          {getTableColumns(activeTab)
            .filter((col) => !["ID", "CREATED_AT"].includes(col.toUpperCase()))
            .map((col) => (
              <div key={col} className={styles.inputGroup}>
                <label>{col}</label>
                <input
                  type={
                    inputTypes[col.toLowerCase()] ||
                    (col.toUpperCase() === "PASSWORD" ? "password" : "text")
                  }
                  name={col}
                  className={styles.inputField}
                  placeholder={`Yeni ${col} girin`}
                  value={localItem[col] || ""}
                  onChange={handleChange}
                  required={col.toUpperCase() === "EMAIL"}
                />
              </div>
            ))}
          {error && <span className={styles.error}>{error}</span>}
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Kaydet
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
