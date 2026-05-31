import { useState } from "react";
import { calculateCalories } from "../api/foodsApi";

function FoodCard({ food }) {
  const [grams, setGrams] = useState(100);
  const [calculation, setCalculation] = useState(null);

  async function handleCalculate() {
    try {
      const result = await calculateCalories(food.id, grams);
      setCalculation(result);
    } catch (error) {
      console.error(error);
      alert("Could not calculate nutrients");
    }
  }

  return (
    <article className="food-card">
      <div className="food-card-header">
        <div>
          <h3>{food.name}</h3>
          <span className="food-group">{food.food_group}</span>
        </div>

        <div className="calorie-badge">
          <strong>{food.calories}</strong>
          <span>kcal / 100g</span>
        </div>
      </div>

      <div className="macro-row">
        <Macro label="Protein" value={food.protein} unit="g" />
        <Macro label="Carbs" value={food.carbohydrates} unit="g" />
        <Macro label="Fat" value={food.fat} unit="g" />
      </div>

      <p className="serving">
        Serving: {food.serving_weight_1}g {food.serving_description_1}
      </p>

      <div className="calculator-box">
        <label>Calculate by grams</label>

        <div className="calculator-controls">
          <input
            type="number"
            min="1"
            value={grams}
            onChange={(event) => setGrams(event.target.value)}
          />

          <button type="button" onClick={handleCalculate}>
            Calculate
          </button>
        </div>
      </div>

      {calculation ? (
        <div className="result-box">
          <h4>
            Nutrition for {calculation.grams}g
          </h4>

          <div className="result-highlight">
            <strong>{calculation.total.calories}</strong>
            <span>calories</span>
          </div>

          <div className="nutrition-grid">
            <Nutrient label="Protein" value={calculation.total.protein} unit="g" />
            <Nutrient label="Carbs" value={calculation.total.carbohydrates} unit="g" />
            <Nutrient label="Fat" value={calculation.total.fat} unit="g" />
            <Nutrient label="Sugars" value={calculation.total.sugars} unit="g" />
            <Nutrient label="Fiber" value={calculation.total.fiber} unit="g" />
            <Nutrient label="Saturated fats" value={calculation.total.saturated_fats} unit="g" />
            <Nutrient label="Cholesterol" value={calculation.total.cholesterol} unit="mg" />
            <Nutrient label="Sodium" value={calculation.total.sodium} unit="mg" />
            <Nutrient label="Calcium" value={calculation.total.calcium} unit="mg" />
            <Nutrient label="Iron" value={calculation.total.iron} unit="mg" />
            <Nutrient label="Potassium" value={calculation.total.potassium} unit="mg" />
            <Nutrient label="Magnesium" value={calculation.total.magnesium} unit="mg" />
          </div>
        </div>
      ) : (
        <div className="nutrition-grid compact">
          <Nutrient label="Sugars" value={food.sugars} unit="g" />
          <Nutrient label="Fiber" value={food.fiber} unit="g" />
          <Nutrient label="Sodium" value={food.sodium} unit="mg" />
          <Nutrient label="Calcium" value={food.calcium} unit="mg" />
          <Nutrient label="Iron" value={food.iron} unit="mg" />
          <Nutrient label="Potassium" value={food.potassium} unit="mg" />
        </div>
      )}
    </article>
  );
}

function Macro({ label, value, unit }) {
  return (
    <div className="macro">
      <strong>{value}</strong>
      <span>{label} {unit}</span>
    </div>
  );
}

function Nutrient({ label, value, unit }) {
  return (
    <div className="nutrient">
      <span>{label}</span>
      <strong>{value} {unit}</strong>
    </div>
  );
}

export default FoodCard;