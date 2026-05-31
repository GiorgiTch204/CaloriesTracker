import FoodCard from "./FoodCard";

function FoodList({ foods }) {
  if (!foods || foods.length === 0) {
    return (
      <div className="empty-state">
        <h3>No foods found</h3>
        <p>Try another search or select a different category.</p>
      </div>
    );
  }

  return (
    <div className="food-list">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
}

export default FoodList;