const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Food calorie API is running"
  });
});

// Get categories from food_group column
app.get("/api/categories", (req, res) => {
  const sql = `
    SELECT food_group, COUNT(*) as count
    FROM foods
    WHERE food_group IS NOT NULL AND food_group != ''
    GROUP BY food_group
    ORDER BY food_group ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);
  });
});

// Get foods, optionally filtered by category
app.get("/api/foods", (req, res) => {
  const limit = Number(req.query.limit) || 50;
  const page = Number(req.query.page) || 1;
  const category = req.query.category || "";
  const offset = (page - 1) * limit;

  let sql = `
    SELECT *
    FROM foods
  `;

  const params = [];

  if (category) {
    sql += `
      WHERE food_group = ?
    `;
    params.push(category);
  }

  sql += `
    ORDER BY name ASC
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json({
      page,
      limit,
      category,
      foods: rows
    });
  });
});

// Search foods by name, optionally inside category
app.get("/api/foods/search", (req, res) => {
  const query = req.query.q;
  const category = req.query.category || "";

  if (!query) {
    return res.status(400).json({
      error: "Search query is required"
    });
  }

  let sql = `
    SELECT *
    FROM foods
    WHERE LOWER(name) LIKE LOWER(?)
  `;

  const params = [`%${query}%`];

  if (category) {
    sql += `
      AND food_group = ?
    `;
    params.push(category);
  }

  sql += `
    ORDER BY
      CASE
        WHEN LOWER(name) = LOWER(?) THEN 1
        WHEN LOWER(name) LIKE LOWER(?) THEN 2
        ELSE 3
      END,
      name ASC
    LIMIT 50
  `;

  params.push(query, `${query}%`);

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json({
      query,
      category,
      results: rows
    });
  });
});

// Get one food
app.get("/api/foods/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT *
    FROM foods
    WHERE id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    if (!row) {
      return res.status(404).json({
        error: "Food not found"
      });
    }

    res.json(row);
  });
});

// Calculate all nutrients by grams
app.post("/api/calculate", (req, res) => {
  const { foodId, grams } = req.body;

  if (!foodId || !grams) {
    return res.status(400).json({
      error: "foodId and grams are required"
    });
  }

  const sql = `
    SELECT *
    FROM foods
    WHERE id = ?
  `;

  db.get(sql, [foodId], (err, food) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    if (!food) {
      return res.status(404).json({
        error: "Food not found"
      });
    }

    const multiplier = Number(grams) / 100;

    function scale(value) {
      return Math.round((Number(value || 0) * multiplier) * 100) / 100;
    }

    res.json({
      foodName: food.name,
      grams: Number(grams),
      per100g: {
        calories: food.calories,
        fat: food.fat,
        protein: food.protein,
        carbohydrates: food.carbohydrates,
        sugars: food.sugars,
        fiber: food.fiber,
        cholesterol: food.cholesterol,
        saturated_fats: food.saturated_fats,
        calcium: food.calcium,
        iron: food.iron,
        potassium: food.potassium,
        magnesium: food.magnesium,
        sodium: food.sodium
      },
      total: {
        calories: scale(food.calories),
        fat: scale(food.fat),
        protein: scale(food.protein),
        carbohydrates: scale(food.carbohydrates),
        sugars: scale(food.sugars),
        fiber: scale(food.fiber),
        cholesterol: scale(food.cholesterol),
        saturated_fats: scale(food.saturated_fats),
        calcium: scale(food.calcium),
        iron: scale(food.iron),
        potassium: scale(food.potassium),
        magnesium: scale(food.magnesium),
        sodium: scale(food.sodium)
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});