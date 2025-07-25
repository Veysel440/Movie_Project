import { logClientError } from "../../services/logger";

export default function SelectField({ label, value, onChange, options }) {
  try {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <select value={value} onChange={onChange} className="auth-input">
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  } catch (err) {
    logError("SelectField", err, "low");
    return <div>Seçim alanı yüklenemedi.</div>;
  }
}
