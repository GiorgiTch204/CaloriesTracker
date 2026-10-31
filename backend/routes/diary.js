const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

router.get("/", requireAuth, (req, res) => {
  const date = req.query.date || today();

  db.all(
    `SELECT * FROM diary_entries WHERE user_id = ? AND entry_date = ? ORDER BY created_at ASC`,
    [req.user.id, date],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
      rows.forEach((row) => {
        if (meals[row.meal_type]) meals[row.meal_type].push(row);
      });

      res.json({ date, meals, entries: rows });
    }
  );
});

router.post("/", requireAuth, (req, res) => {
  const { foodId, foodName, mealType, grams, calories, protein, carbohydrates, fat, date } = req.body || {};

  if (!foodName || !mealType || !grams) {
    return res.status(400).json({ error: "foodName, mealType and grams are required" });
  }
  if (!MEAL_TYPES.includes(mealType)) {
    return res.status(400).json({ error: `mealType must be one of ${MEAL_TYPES.join(", ")}` });
  }

  const entryDate = date || today();

  db.run(
    `INSERT INTO diary_entries (user_id, food_id, food_name, meal_type, grams, calories, protein, carbohydrates, fat, entry_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.id,
      foodId || null,
      foodName,
      mealType,
      Number(grams),
      Number(calories) || 0,
      Number(protein) || 0,
      Number(carbohydrates) || 0,
      Number(fat) || 0,
      entryDate
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.get("SELECT * FROM diary_entries WHERE id = ?", [this.lastID], (e2, row) => {
        if (e2) return res.status(500).json({ error: e2.message });
        res.status(201).json({ entry: row });
      });
    }
  );
});

router.put("/:id", requireAuth, (req, res) => {
  const { grams, mealType, calories, protein, carbohydrates, fat } = req.body || {};

  db.get("SELECT * FROM diary_entries WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Entry not found" });

    const updated = {
      grams: grams !== undefined ? Number(grams) : row.grams,
      meal_type: mealType && MEAL_TYPES.includes(mealType) ? mealType : row.meal_type,
      calories: calories !== undefined ? Number(calories) : row.calories,
      protein: protein !== undefined ? Number(protein) : row.protein,
      carbohydrates: carbohydrates !== undefined ? Number(carbohydrates) : row.carbohydrates,
      fat: fat !== undefined ? Number(fat) : row.fat
    };

    db.run(
      `UPDATE diary_entries SET grams = ?, meal_type = ?, calories = ?, protein = ?, carbohydrates = ?, fat = ? WHERE id = ?`,
      [updated.grams, updated.meal_type, updated.calories, updated.protein, updated.carbohydrates, updated.fat, row.id],
      (e2) => {
        if (e2) return res.status(500).json({ error: e2.message });
        db.get("SELECT * FROM diary_entries WHERE id = ?", [row.id], (e3, fresh) => {
          if (e3) return res.status(500).json({ error: e3.message });
          res.json({ entry: fresh });
        });
      }
    );
  });
});

router.delete("/:id", requireAuth, (req, res) => {
  db.run("DELETE FROM diary_entries WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Entry not found" });
    res.json({ success: true });
  });
});

module.exports = router;
