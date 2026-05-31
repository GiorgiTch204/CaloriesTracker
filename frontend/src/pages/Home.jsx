import { useEffect, useState } from "react";
import {
  getCategories,
  getFoods,
  searchFoods
} from "../api/foodsApi";
import FoodList from "../components/FoodList";

function Home() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadFoods(currentPage = 1, category = selectedCategory) {
    try {
      setLoading(true);
      setIsSearching(false);

      const data = await getFoods(currentPage, 50, category);

      setFoods(data.foods);
      setPage(data.page);
    } catch (error) {
      console.error(error);
      alert("Could not load foods. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    if (searchTerm.trim() === "") {
      loadFoods(1, selectedCategory);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);

      const data = await searchFoods(searchTerm, selectedCategory);

      setFoods(data.results);
    } catch (error) {
      console.error(error);
      alert("Could not search foods.");
    } finally {
      setLoading(false);
    }
  }

  function handleCategoryClick(category) {
    setSelectedCategory(category);
    setSearchTerm("");
    loadFoods(1, category);
  }

  function showAllFoods() {
    setSelectedCategory("");
    setSearchTerm("");
    loadFoods(1, "");
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
    loadFoods(1, "");
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🥗</div>
          <div>
            <h2>NutriTrack</h2>
            <p>Food calories & nutrients</p>
          </div>
        </div>

        <button
          className={selectedCategory === "" ? "category active" : "category"}
          onClick={showAllFoods}
        >
          <span>🍽️ All Foods</span>
        </button>

        <div className="category-title">Categories</div>

        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category.food_group}
              className={
                selectedCategory === category.food_group
                  ? "category active"
                  : "category"
              }
              onClick={() => handleCategoryClick(category.food_group)}
            >
              <span>{getCategoryIcon(category.food_group)} {category.food_group}</span>
              <small>{category.count}</small>
            </button>
          ))}
        </div>
      </aside>

      <main className="main-content">
        <section className="hero">
          <div>
            <h1>Food Calorie Calculator</h1>
            <p>
              Search foods, browse categories, and calculate calories, macros,
              minerals, and sodium for any gram amount.
            </p>
          </div>

          <div className="hero-card">
            <span className="hero-number">{foods.length}</span>
            <span>items shown</span>
          </div>
        </section>

        <form className="search-panel" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search food: banana, milk, bread, rice..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        <div className="current-filter">
          {selectedCategory ? (
            <span>Category: <strong>{selectedCategory}</strong></span>
          ) : (
            <span>Showing: <strong>All Foods</strong></span>
          )}
        </div>

        {loading && <p className="loading">Loading foods...</p>}

        {!loading && <FoodList foods={foods} />}

        {!isSearching && (
          <div className="pagination">
            <button
              disabled={page <= 1}
              onClick={() => loadFoods(page - 1, selectedCategory)}
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button onClick={() => loadFoods(page + 1, selectedCategory)}>
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function getCategoryIcon(category) {
  const text = category.toLowerCase();

  if (text.includes("beverage")) return "🥤";
  if (text.includes("baked")) return "🥐";
  if (text.includes("sweet")) return "🍬";
  if (text.includes("fruit")) return "🍌";
  if (text.includes("vegetable")) return "🥦";
  if (text.includes("baby")) return "🍼";
  if (text.includes("dairy")) return "🥛";
  if (text.includes("meat")) return "🥩";
  if (text.includes("breakfast")) return "🥣";
  if (text.includes("snack")) return "🍿";
  if (text.includes("soup")) return "🍲";
  if (text.includes("seafood")) return "🐟";

  return "🍴";
}

export default Home;