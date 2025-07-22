import { useEffect, useState } from "react";

export default function LogDetailModal({ logId, onClose }) {
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!logId) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/ERROR_LOGS/${logId}`);
        const data = await res.json();
        if (data.success) {
          setDetail(data.detail);
        } else {
          setDetail("Detay yüklenemedi.");
        }
      } catch {
        setDetail("Sunucu hatası.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [logId]);

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.7)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          width: "80%",
          height: "80%",
          overflow: "auto",
        }}
      >
        <h2>Log Detayı (ID: {logId})</h2>
        {loading ? <p>Yükleniyor...</p> : <pre>{detail}</pre>}
        <button onClick={onClose}>Kapat</button>
      </div>
    </div>
  );
}
