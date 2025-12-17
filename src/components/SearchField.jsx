export default function SearchField({ value, onChange }) {
  return (
    <div className="search-field">
      <input
        className="ds-input"
        type="text"
        placeholder="Search books..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}