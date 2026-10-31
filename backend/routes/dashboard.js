const express = require("express");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function today() {
  return new Date().toISOString().slice(0, 10);
}

function dateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function getUser(userId) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getEntriesForDate(userId, date) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM diary_entries WHERE user_id = ? AND entry_date = ? ORDER BY created_at ASC",
      [userId, date],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

function getTrend(userId, startDate) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT entry_date, SUM(calories) as calories, SUM(protein) as protein, SUM(carbohydrates) as carbohydrates, SUM(fat) as fat
       FROM diary_entries
       WHERE user_id = ? AND entry_date >= ?
       GROUP BY entry_date
       ORDER BY entry_date ASC`,
      [userId, startDate],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const date = req.query.date || today();
    const user = await getUser(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const entries = await getEntriesForDate(req.user.id, date);

    const totals = entries.reduce(
      (acc, e) => {
        acc.calories += e.calories;
        acc.protein += e.protein;
        acc.carbohydrates += e.carbohydrates;
        acc.fat += e.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );

    const meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    entries.forEach((e) => {
      if (meals[e.meal_type]) meals[e.meal_type].push(e);
    });

    const trendRows = await getTrend(req.user.id, dateNDaysAgo(6));
    const trendMap = new Map(trendRows.map((r) => [r.entry_date, r]));
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const d = dateNDaysAgo(i);
      const row = trendMap.get(d);
      trend.push({
        date: d,
        calories: row ? Math.round(row.calories) : 0,
        protein: row ? Math.round(row.protein) : 0,
        carbohydrates: row ? Math.round(row.carbohydrates) : 0,
        fat: row ? Math.round(row.fat) : 0
      });
    }

    res.json({
      date,
      targets: {
        calories: user.calorie_target,
        protein: user.protein_target,
        carbohydrates: user.carbs_target,
        fat: user.fat_target
      },
      totals: {
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein * 10) / 10,
        carbohydrates: Math.round(totals.carbohydrates * 10) / 10,
        fat: Math.round(totals.fat * 10) / 10
      },
      remaining: Math.round(user.calorie_target - totals.calories),
      meals,
      recentEntries: entries.slice(-5).reverse(),
      trend,
      hasAnyData: entries.length > 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
