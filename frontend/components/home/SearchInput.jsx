export default function SearchInput({ value, onChange }) {
  return (
    <input
      type="search"
      placeholder="Film ara..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-input"
    />
  );
}
