const bcrypt = require("bcryptjs");
const db = require("./db");

// Creates the app tables (users, diary_entries) alongside the existing
// `foods` table, and seeds a demo admin + demo user so the app is usable
// immediately after a fresh clone.
function migrate() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        name TEXT NOT NULL,
        avatar_url TEXT,
        provider TEXT NOT NULL DEFAULT 'local',
        google_id TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        is_pro INTEGER NOT NULL DEFAULT 0,
        calorie_target REAL NOT NULL DEFAULT 2000,
        protein_target REAL NOT NULL DEFAULT 150,
        carbs_target REAL NOT NULL DEFAULT 250,
        fat_target REAL NOT NULL DEFAULT 65,
        theme TEXT NOT NULL DEFAULT 'light',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        food_id INTEGER,
        food_name TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        grams REAL NOT NULL,
        calories REAL NOT NULL DEFAULT 0,
        protein REAL NOT NULL DEFAULT 0,
        carbohydrates REAL NOT NULL DEFAULT 0,
        fat REAL NOT NULL DEFAULT 0,
        entry_date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    db.run(`CREATE INDEX IF NOT EXISTS idx_diary_user_date ON diary_entries (user_id, entry_date)`);

    // Seed a demo admin + demo user, only if the users table is empty.
    db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
      if (err || !row || row.count > 0) return;

      const adminHash = bcrypt.hashSync("admin123", 10);
      const demoHash = bcrypt.hashSync("demo1234", 10);

      db.run(
        `INSERT INTO users (email, password_hash, name, role, is_pro, calorie_target, protein_target, carbs_target, fat_target)
         VALUES (?, ?, ?, 'admin', 1, 2200, 160, 230, 70)`,
        ["admin@nutritrack.app", adminHash, "NutriTrack Admin"]
      );

      db.run(
        `INSERT INTO users (email, password_hash, name, role, is_pro, calorie_target, protein_target, carbs_target, fat_target)
         VALUES (?, ?, ?, 'user', 0, 2000, 150, 250, 65)`,
        ["demo@nutritrack.app", demoHash, "Demo User"]
      );

      console.log("Seeded demo accounts: admin@nutritrack.app / admin123, demo@nutritrack.app / demo1234");
    });
  });
}

module.exports = migrate;
