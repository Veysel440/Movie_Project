import { logClientError } from "../../services/logger";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  try {
    if (!label || typeof onChange !== "function") {
      throw new Error("InputField props eksik ya da hatalı");
    }
  } catch (err) {
    logClientError(
      "InputField",
      "Bileşen hatalı kullanıldı",
      err.message,
      "low"
    );
  }

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
}
