const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("../db");

const csvPath = path.join(__dirname, "..", "data", "nutrition.csv");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS foods");

  db.run(`
    CREATE TABLE foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      serving_size TEXT,
      calories REAL,
      protein REAL,
      carbohydrates REAL,
      fat REAL,
      fiber REAL,
      sugar REAL,
      sodium REAL
    )
  `);

  const insertFood = db.prepare(`
    INSERT INTO foods (
      name,
      category,
      serving_size,
      calories,
      protein,
      carbohydrates,
      fat,
      fiber,
      sugar,
      sodium
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
      /*
        IMPORTANT:
        Your CSV column names may be different.
        First run the script and console.log(row) if needed.
      */

      const name =
        row.name ||
        row.Name ||
        row.food ||
        row.Food ||
        row.description ||
        row.Description ||
        "";

      const category =
        row.category ||
        row.Category ||
        row.food_group ||
        row.FoodGroup ||
        "";

      const servingSize =
        row.serving_size ||
        row.Serving_Size ||
        row.serving ||
        row.Serving ||
        "100g";

      const calories =
        row.calories ||
        row.Calories ||
        row.Energy ||
        row.energy_kcal ||
        0;

      const protein =
        row.protein ||
        row.Protein ||
        row.Protein_g ||
        0;

      const carbohydrates =
        row.carbohydrates ||
        row.Carbohydrates ||
        row.Carbs ||
        row.Carbohydrate_g ||
        0;

      const fat =
        row.fat ||
        row.Fat ||
        row.TotalFat ||
        row.Fat_g ||
        0;

      const fiber =
        row.fiber ||
        row.Fiber ||
        row.Fiber_g ||
        0;

      const sugar =
        row.sugar ||
        row.Sugar ||
        row.Sugars ||
        row.Sugar_g ||
        0;

      const sodium =
        row.sodium ||
        row.Sodium ||
        row.Sodium_mg ||
        0;

      if (name.trim() !== "") {
        insertFood.run(
          name,
          category,
          servingSize,
          Number(calories) || 0,
          Number(protein) || 0,
          Number(carbohydrates) || 0,
          Number(fat) || 0,
          Number(fiber) || 0,
          Number(sugar) || 0,
          Number(sodium) || 0
        );
      }
    })
    .on("end", () => {
      insertFood.finalize();
      console.log("CSV imported successfully.");
      db.close();
    });
});