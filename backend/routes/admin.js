const express = require("express");
const db = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { toPublicUser } = require("../utils/serialize");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", (req, res) => {
  const stats = {};

  const queries = [
    ["totalUsers", "SELECT COUNT(*) as n FROM users"],
    ["proUsers", "SELECT COUNT(*) as n FROM users WHERE is_pro = 1"],
    ["totalFoods", "SELECT COUNT(*) as n FROM foods"],
    ["totalDiaryEntries", "SELECT COUNT(*) as n FROM diary_entries"],
    ["entriesToday", `SELECT COUNT(*) as n FROM diary_entries WHERE entry_date = date('now')`],
    ["newUsersLast7Days", `SELECT COUNT(*) as n FROM users WHERE created_at >= datetime('now', '-7 days')`]
  ];

  let remaining = queries.length;
  let hasError = false;

  queries.forEach(([key, sql]) => {
    db.get(sql, [], (err, row) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        return res.status(500).json({ error: err.message });
      }
      stats[key] = row.n;
      remaining -= 1;
      if (remaining === 0) {
        stats.monthlyRecurringRevenue = Math.round(stats.proUsers * 9.99 * 100) / 100;
        res.json({ stats });
      }
    });
  });
});

router.get("/users", (req, res) => {
  db.all(
    `SELECT u.*,
       (SELECT COUNT(*) FROM diary_entries d WHERE d.user_id = u.id) as entry_count
     FROM users u
     ORDER BY u.created_at DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        users: rows.map((r) => ({ ...toPublicUser(r), entryCount: r.entry_count }))
      });
    }
  );
});

router.put("/users/:id/role", (req, res) => {
  const { role } = req.body || {};
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "role must be 'user' or 'admin'" });
  }

  db.run("UPDATE users SET role = ? WHERE id = ?", [role, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "User not found" });

    db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (e2, row) => {
      if (e2) return res.status(500).json({ error: e2.message });
      res.json({ user: toPublicUser(row) });
    });
  });
});

router.delete("/users/:id", (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ error: "You cannot delete your own account" });
  }

  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "User not found" });
    res.json({ success: true });
  });
});

module.exports = router;
