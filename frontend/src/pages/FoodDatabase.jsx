import { useCallback, useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import api from "../lib/api";
import FoodCard from "../components/FoodCard";
import FoodDetailModal from "../components/FoodDetailModal";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const PAGE_SIZE = 20;

export default function FoodDatabase() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(() => {
    setLoading(true);
    const endpoint = debouncedQuery ? "/foods/search" : "/foods";
    const params = debouncedQuery
      ? { q: debouncedQuery, category, page, limit: PAGE_SIZE }
      : { category, page, limit: PAGE_SIZE };

    api
      .get(endpoint, { params })
      .then(({ data }) => {
        setFoods(data.results || data.foods || []);
        setTotalPages(data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, category, page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 14,000+ foods..."
            className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-9 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-50"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none focus:border-moss-400 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-50 sm:w-56"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.food_group} value={c.food_group}>
              {c.food_group} ({c.count})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader full label="Loading foods" />
      ) : foods.length === 0 ? (
        <EmptyState icon={Search} title="No foods found" description="Try a different search term or category." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} onSelect={setSelected} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-50 disabled:opacity-40 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
            >
              <ChevronLeft size={15} /> Prev
            </button>
            <span className="text-sm text-ink-500 dark:text-ink-400">
              Page {page} of {totalPages.toLocaleString()}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-50 disabled:opacity-40 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </>
      )}

      <FoodDetailModal food={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
