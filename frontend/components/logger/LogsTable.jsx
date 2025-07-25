import { useState, useEffect } from "react";
import LogDetailModal from "./LogDetailModal";
import styles from "../../styles/adminLogs.module.css";

export default function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedLogId, setSelectedLogId] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    setLoading(true);
    fetch("http://localhost:3001/api/ERROR_LOGS")
      .then((res) => res.json())
      .then((json) => {
        setLogs(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Log ID ${id} silinsin mi?`)) return;
    await fetch(`http://localhost:3001/api/ERROR_LOGS/${id}`, {
      method: "DELETE",
    });
    fetchLogs();
  };

  const filteredLogs =
    severityFilter === "all"
      ? logs
      : logs.filter((log) => log.SEVERITY === severityFilter);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className={styles.logTableContainer}>
      <h2 className={styles.logTableTitle}>🛑 Hata Logları</h2>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Filtre:
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="all">Tümü</option>
            <option value="low">Düşük (low)</option>
            <option value="mid">Orta (mid)</option>
            <option value="high">Yüksek (high)</option>
          </select>
        </label>
      </div>
      <div className={styles.logTableWrapper}>
        <table className={styles.logTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Konum</th>
              <th>Mesaj</th>
              <th>Seviye</th>
              <th>Tarih</th>
              <th>Detay</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Seçilen seviyede log bulunamadı.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.ID}>
                  <td>{log.ID}</td>
                  <td style={{ maxWidth: 140, wordBreak: "break-word" }}>
                    {log.LOCATION}
                  </td>
                  <td style={{ maxWidth: 240, wordBreak: "break-word" }}>
                    {log.MESSAGE}
                  </td>
                  <td
                    className={
                      log.SEVERITY === "high"
                        ? styles.severityHigh
                        : log.SEVERITY === "mid"
                        ? styles.severityMid
                        : styles.severityLow
                    }
                  >
                    {log.SEVERITY}
                  </td>
                  <td>{log.CREATED_AT}</td>
                  <td>
                    <button
                      className={`${styles.logActionBtn} ${styles.detail}`}
                      onClick={() => setSelectedLogId(log.ID)}
                    >
                      Detay
                    </button>
                  </td>
                  <td>
                    <button
                      className={`${styles.logActionBtn} ${styles.delete}`}
                      onClick={() => handleDelete(log.ID)}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedLogId && (
        <LogDetailModal
          logId={selectedLogId}
          onClose={() => setSelectedLogId(null)}
        />
      )}
    </div>
  );
}
