import { logClientError } from "../../services/logger";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  try {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="auth-input"
        />
      </div>
    );
  } catch (err) {
    logError("InputField", err, "low");
    return <div>Giriş alanı yüklenemedi.</div>;
  }
}
