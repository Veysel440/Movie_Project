import { logClientError } from "../../services/logger";

export default function SearchInput({ value, onChange }) {
  const handleChange = (e) => {
    try {
      if (typeof onChange !== "function") {
        throw new Error("onChange fonksiyonu eksik");
      }
      onChange(e.target.value);
    } catch (err) {
      logClientError("SearchInput", err.message, "", "low");
    }
  };

  return (
    <input
      type="search"
      placeholder="Film ara..."
      value={value}
      onChange={handleChange}
      className="search-input"
    />
  );
}
