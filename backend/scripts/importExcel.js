const path = require("path");
const XLSX = require("xlsx");
const db = require("../db");

const excelPath = path.join(
  __dirname,
  "..",
  "data",
  "MyFoodData-Nutrition-Facts-SpreadSheet-Release-1-4.xlsx"
);

const workbook = XLSX.readFile(excelPath);
const sheetName = "SR Legacy and FNDDS";
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
  console.log("Sheet not found:", sheetName);
  console.log("Available sheets:", workbook.SheetNames);
  process.exit();
}

const rawRows = XLSX.utils.sheet_to_json(sheet, {
  header: 1,
  defval: ""
});

console.log("Sheet name:", sheetName);
console.log("Total raw rows:", rawRows.length);

let headerRowIndex = -1;

for (let i = 0; i < Math.min(rawRows.length, 50); i++) {
  const row = rawRows[i].map((cell) => String(cell).trim());

  const hasID = row.includes("ID");
  const hasName = row.includes("name");
  const hasFoodGroup = row.includes("Food Group");
  const hasCalories = row.includes("Calories");

  if (hasID && hasName && hasFoodGroup && hasCalories) {
    headerRowIndex = i;
    break;
  }
}

if (headerRowIndex === -1) {
  console.log("Could not find real header row.");
  console.log("First 20 rows:");
  rawRows.slice(0, 20).forEach((row, index) => {
    console.log("ROW", index, row);
  });
  process.exit();
}

console.log("Detected header row index:", headerRowIndex);
console.log("Header row:");
console.log(rawRows[headerRowIndex]);

const headers = rawRows[headerRowIndex].map((header, index) => {
  const cleanHeader = String(header).trim();

  if (!cleanHeader) {
    return `column_${index}`;
  }

  return cleanHeader;
});

const dataRows = rawRows.slice(headerRowIndex + 1);

const rows = dataRows.map((row) => {
  const obj = {};

  headers.forEach((header, index) => {
    obj[header] = row[index] ?? "";
  });

  return obj;
});

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS foods");

  db.run(`
    CREATE TABLE foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT,
      name TEXT,
      food_group TEXT,
      calories REAL,
      fat REAL,
      protein REAL,
      carbohydrates REAL,
      sugars REAL,
      fiber REAL,
      cholesterol REAL,
      saturated_fats REAL,
      calcium REAL,
      iron REAL,
      potassium REAL,
      magnesium REAL,
      sodium REAL,
      serving_weight_1 REAL,
      serving_description_1 TEXT,
      data_json TEXT
    )
  `);

  const insertFood = db.prepare(`
    INSERT INTO foods (
      source_id,
      name,
      food_group,
      calories,
      fat,
      protein,
      carbohydrates,
      sugars,
      fiber,
      cholesterol,
      saturated_fats,
      calcium,
      iron,
      potassium,
      magnesium,
      sodium,
      serving_weight_1,
      serving_description_1,
      data_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let insertedCount = 0;

  rows.forEach((row) => {
    const sourceId = String(row["ID"] || "").trim();
    const name = String(row["name"] || "").trim();

    if (!sourceId || !name) {
      return;
    }

    if (sourceId.toLowerCase() === "id") {
      return;
    }

    insertFood.run(
      row["ID"] || "",
      row["name"] || "",
      row["Food Group"] || "",
      Number(row["Calories"]) || 0,
      Number(row["Fat (g)"]) || 0,
      Number(row["Protein (g)"]) || 0,
      Number(row["Carbohydrate (g)"]) || 0,
      Number(row["Sugars (g)"]) || 0,
      Number(row["Fiber (g)"]) || 0,
      Number(row["Cholesterol (mg)"]) || 0,
      Number(row["Saturated Fats (g)"]) || 0,
      Number(row["Calcium (mg)"]) || 0,
      Number(row["Iron, Fe (mg)"]) || 0,
      Number(row["Potassium, K (mg)"]) || 0,
      Number(row["Magnesium (mg)"]) || 0,
      Number(row["Sodium (mg)"]) || 0,
      Number(row["Serving Weight 1 (g)"]) || 100,
      row["Serving Description 1 (g)"] || "100g",
      JSON.stringify(row)
    );

    insertedCount++;
  });

  insertFood.finalize();

  console.log("Excel imported successfully.");
  console.log("Rows inserted:", insertedCount);

  db.get("SELECT COUNT(*) AS count FROM foods", [], (err, result) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Foods in database:", result.count);
    }

    db.close();
  });
});