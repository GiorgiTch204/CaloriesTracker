const path = require("path");
const XLSX = require("xlsx");

const excelPath = path.join(
  __dirname,
  "..",
  "data",
  "MyFoodData-Nutrition-Facts-SpreadSheet-Release-1-4.xlsx"
);

const workbook = XLSX.readFile(excelPath);

console.log("Sheet names:");
console.log(workbook.SheetNames);

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const rawRows = XLSX.utils.sheet_to_json(sheet, {
  header: 1,
  defval: ""
});

console.log("Using sheet:", sheetName);
console.log("Total rows:", rawRows.length);

console.log("\nFirst 40 rows:");
rawRows.slice(0, 40).forEach((row, index) => {
  console.log("ROW", index, ":", row);
});