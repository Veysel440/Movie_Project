import { useState, useEffect } from "react";
import LogDetailModal from "./LogDetailModal";

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
      .catch((err) => {
        console.error("Loglar alınamadı:", err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Log ID ${id} silinsin mi?`)) return;

    try {
      await fetch(`http://localhost:3001/api/ERROR_LOGS/${id}`, {
        method: "DELETE",
      });
      fetchLogs();
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const filteredLogs =
    severityFilter === "all"
      ? logs
      : logs.filter((log) => log.SEVERITY === severityFilter);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>🛑 Hata Logları</h2>

      {selectedLogId && (
        <LogDetailModal
          logId={selectedLogId}
          onClose={() => setSelectedLogId(null)}
        />
      )}

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

      <table style={{ width: "100%", fontSize: "12px" }}>
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
              <td colSpan="7">Seçilen seviyede log bulunamadı.</td>
            </tr>
          ) : (
            filteredLogs.map((log) => (
              <tr key={log.ID}>
                <td>{log.ID}</td>
                <td>{log.LOCATION}</td>
                <td>{log.MESSAGE}</td>
                <td>{log.SEVERITY}</td>
                <td>{log.CREATED_AT}</td>
                <td>
                  <button onClick={() => setSelectedLogId(log.ID)}>
                    Detay
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(log.ID)}>Sil</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
