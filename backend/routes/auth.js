const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const db = require("../db");
const { JWT_SECRET, requireAuth } = require("../middleware/auth");
const { toPublicUser } = require("../utils/serialize");

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Tells the frontend whether "Sign in with Google" can actually be used,
// so the UI can show a helpful message instead of a dead button.
router.get("/google/config", (req, res) => {
  res.json({ enabled: !!GOOGLE_CLIENT_ID, clientId: GOOGLE_CLIENT_ID || null });
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await getUserByEmail(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (email, password_hash, name, provider) VALUES (?, ?, ?, 'local')`,
      [email.toLowerCase().trim(), hash, name.trim()],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        getUserById(this.lastID)
          .then((user) => {
            const token = signToken(user);
            res.status(201).json({ token, user: toPublicUser(user) });
          })
          .catch((e) => res.status(500).json({ error: e.message }));
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await getUserByEmail(email.toLowerCase().trim());
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sign in / sign up with a Google ID token obtained on the frontend via
// Google Identity Services. Requires GOOGLE_CLIENT_ID to be configured.
router.post("/google", async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(503).json({
        error: "Google sign-in isn't configured on this server yet. Set GOOGLE_CLIENT_ID in backend/.env."
      });
    }

    const { credential } = req.body || {};
    if (!credential) {
      return res.status(400).json({ error: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase().trim();

    let user = await getUserByEmail(email);

    if (!user) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO users (email, name, avatar_url, provider, google_id) VALUES (?, ?, ?, 'google', ?)`,
          [email, payload.name || email, payload.picture || null, payload.sub],
          function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
          }
        );
      });
      user = await getUserByEmail(email);
    }

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    res.status(401).json({ error: "Google sign-in failed: " + err.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
