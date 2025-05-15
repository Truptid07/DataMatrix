export default function SearchFilters({ search, setSearch, resetFilters }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <input
        type="text"
        placeholder="Search by name or uploader..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md w-full sm:max-w-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
      />
      <button
        onClick={resetFilters}
        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full sm:w-auto cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );
}
