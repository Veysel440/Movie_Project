import styles from "../styles/admin.module.css";
import Modal from "./Modal";
import {
  handleAdd,
  handleUpdate,
  handleDelete,
  truncateDescription,
} from "../services/api";

export default function BaseTable({
  title,
  columns,
  activeTab,
  data,
  fetchData,
  newItem,
  setNewItem,
  editItem,
  setEditItem,
  error,
  setError,
  isAddModalOpen,
  setIsAddModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  modalTitles = { add: "Yeni Kayıt Ekle", edit: "Kaydı Düzenle" },
  truncateFields = [],
  keyField = "ID",
  inputTypes = {},
}) {
  const handleAddSave = async (item) => {
    await handleAdd(
      item,
      activeTab,
      setNewItem,
      () => setIsAddModalOpen(false),
      fetchData,
      setError
    );
  };

  const handleEditSave = async (item) => {
    await handleUpdate(
      item,
      activeTab,
      setEditItem,
      () => setIsEditModalOpen(false),
      fetchData,
      setError
    );
  };

  const handleEditOpen = (item) => {
    const edited = {};
    columns.forEach((col) => {
      edited[col] = item[col] || item[col.toUpperCase()] || "";
    });
    setEditItem(edited);
    setIsEditModalOpen(true);
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.adminTitle}>{title}</h1>
      <button
        className={styles.addButton}
        onClick={() => setIsAddModalOpen(true)}
      >
        Yeni Ekle
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <table className={styles.adminTable}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr
                key={
                  item[keyField] ||
                  item.EMAIL ||
                  item.LINK ||
                  Math.random().toString(36).substr(2, 9)
                }
              >
                {columns.map((col) => (
                  <td key={col}>
                    {truncateFields.includes(col)
                      ? truncateDescription(
                          item[col] || item[col.toUpperCase()] || "Yok",
                          50
                        )
                      : item[col] || item[col.toUpperCase()] || "Yok"}
                  </td>
                ))}
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditOpen(item)}
                  >
                    Düzenle
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() =>
                      handleDelete(item, activeTab, fetchData, setError)
                    }
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1}>Veri bulunamadı</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={modalTitles.add}
        item={newItem}
        setItem={setNewItem}
        activeTab={activeTab}
        onSave={handleAddSave}
        setError={setError}
        inputTypes={inputTypes}
      />
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={modalTitles.edit}
        item={editItem}
        setItem={setEditItem}
        activeTab={activeTab}
        onSave={handleEditSave}
        setError={setError}
        inputTypes={inputTypes}
      />
    </div>
  );
}
