const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { requireAuth } = require("../middleware/auth");
const { toPublicUser } = require("../utils/serialize");

const router = express.Router();

const uploadsDir = path.join(__dirname, "..", "uploads", "avatars");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    cb(null, `${req.user.id}-${crypto.randomBytes(8).toString("hex")}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  }
});

function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/me", requireAuth, async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    db.run("UPDATE users SET name = ? WHERE id = ?", [name.trim(), req.user.id], async (err) => {
      if (err) return res.status(500).json({ error: err.message });
      const user = await getUserById(req.user.id);
      res.json({ user: toPublicUser(user) });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/me/settings", requireAuth, async (req, res) => {
  try {
    const { calorieTarget, proteinTarget, carbsTarget, fatTarget, theme } = req.body || {};

    const updates = [];
    const params = [];

    if (calorieTarget !== undefined) { updates.push("calorie_target = ?"); params.push(Number(calorieTarget)); }
    if (proteinTarget !== undefined) { updates.push("protein_target = ?"); params.push(Number(proteinTarget)); }
    if (carbsTarget !== undefined) { updates.push("carbs_target = ?"); params.push(Number(carbsTarget)); }
    if (fatTarget !== undefined) { updates.push("fat_target = ?"); params.push(Number(fatTarget)); }
    if (theme !== undefined && ["light", "dark"].includes(theme)) { updates.push("theme = ?"); params.push(theme); }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    params.push(req.user.id);

    db.run(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params, async (err) => {
      if (err) return res.status(500).json({ error: err.message });
      const user = await getUserById(req.user.id);
      res.json({ user: toPublicUser(user) });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/me/password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const user = await getUserById(req.user.id);
    if (user.password_hash) {
      const valid = currentPassword && (await bcrypt.compare(currentPassword, user.password_hash));
      if (!valid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
    }

    const hash = await bcrypt.hash(newPassword, 10);
    db.run("UPDATE users SET password_hash = ? WHERE id = ?", [hash, req.user.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/me/avatar", requireAuth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const previous = await getUserById(req.user.id);
    db.run("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, req.user.id], async (err) => {
      if (err) return res.status(500).json({ error: err.message });

      if (previous && previous.avatar_url && previous.avatar_url.startsWith("/uploads/avatars/")) {
        const oldPath = path.join(__dirname, "..", previous.avatar_url);
        fs.unlink(oldPath, () => {});
      }

      const user = await getUserById(req.user.id);
      res.json({ user: toPublicUser(user) });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fake $9.99/mo Pro upgrade — no real payment processor is involved.
router.post("/me/upgrade", requireAuth, async (req, res) => {
  try {
    db.run("UPDATE users SET is_pro = 1 WHERE id = ?", [req.user.id], async (err) => {
      if (err) return res.status(500).json({ error: err.message });
      const user = await getUserById(req.user.id);
      res.json({ user: toPublicUser(user) });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/me/downgrade", requireAuth, async (req, res) => {
  db.run("UPDATE users SET is_pro = 0 WHERE id = ?", [req.user.id], async (err) => {
    if (err) return res.status(500).json({ error: err.message });
    const user = await getUserById(req.user.id);
    res.json({ user: toPublicUser(user) });
  });
});

module.exports = router;
