import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Search dishes...' }) {
  return (
    <div className="relative w-full sm:w-72">
      <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" size={16} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field !pl-10 !pr-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600"
          aria-label="Clear search"
        >
          <FiX size={15} />
        </button>
      )}
    </div>
  );
}
