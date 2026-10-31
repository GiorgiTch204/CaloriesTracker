const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// NOTE: despite the ".csv" extension this is an actual SQLite database file
// (kept as-is from the original project to avoid changing the architecture).
const dbPath = path.join(__dirname, "database", "nutrition.csv");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.run("PRAGMA foreign_keys = ON");

module.exports = db;
