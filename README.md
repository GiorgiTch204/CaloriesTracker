# NutriTrack

A full-stack nutrition tracking app: dashboard, food diary, a searchable 14,000+ food database, user accounts (email/password + Google), editable profiles, an admin panel, and a (demo) Pro upgrade.

Built on top of the original Food Calories Tracker backend (Express + SQLite) and a rewritten React + Tailwind frontend — same architecture, same dataset, new product.

---

## Project structure

```
NutriTrack/
├── backend/          Express API + SQLite database
│   ├── database/      the actual SQLite file (nutrition.csv — misnamed but it's a .sqlite db)
│   ├── routes/         auth, users, diary, dashboard, admin
│   ├── middleware/      JWT auth + admin guard
│   ├── uploads/avatars/ uploaded profile pictures
│   ├── migrate.js       creates app tables + seeds demo accounts on first boot
│   └── server.js
└── frontend/         React 19 + Vite + Tailwind
    └── src/
        ├── pages/       Dashboard, Diary, FoodDatabase, Profile, Settings, Pricing, Admin, Login, Register
        ├── components/  Sidebar, Topbar, CalorieRing, charts, modals, Loader, etc.
        └── context/      auth, theme, toast
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # already has a dev JWT secret placeholder — edit as needed
npm run dev                # http://localhost:5000
```

On first boot it creates the `users` and `diary_entries` tables alongside the existing `foods` table, and seeds two demo accounts:

| Email | Password | Role |
|---|---|---|
| `admin@nutritrack.app` | `admin123` | Admin |
| `demo@nutritrack.app` | `demo1234` | User |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

The dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so just run both and open the frontend URL.

### 3. Production build

```bash
cd frontend && npm run build   # outputs frontend/dist
cd backend && npm start        # serves the API on $PORT (default 5000)
```

Serve `frontend/dist` with any static host (or behind the same Express app / a reverse proxy) and point it at the backend's `/api`.

## Google sign-in

Google sign-in is wired up end-to-end (frontend button + backend token verification) but disabled until you provide a Google OAuth Client ID:

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an **OAuth Client ID** of type "Web application".
2. Add your frontend origin (e.g. `http://localhost:5173`) under **Authorized JavaScript origins**.
3. Put the client ID in `backend/.env` as `GOOGLE_CLIENT_ID=...`.
4. Restart the backend. The "Continue with Google" button on Login/Register will light up automatically — no frontend changes needed.

Without a client ID configured, the button is disabled with an explanatory tooltip; email/password accounts work regardless.

## Notes on the "Pro" plan

The $9.99/mo upgrade in Settings → Pricing is a demo checkout: it collects no real payment and stores no card details. It flips an `is_pro` flag on the account, which unlocks the "Weekly insights" panel on the dashboard. Swap in a real payment provider (Stripe, etc.) before using this in production.

## Admin panel

Visit `/admin` while signed in as an admin (seeded `admin@nutritrack.app`). It shows platform stats (users, Pro members, foods, diary activity, estimated MRR) and a user table where you can promote/demote roles or remove accounts.

## Tech stack

- **Backend:** Node.js, Express, SQLite (`sqlite3`), JWT (`jsonwebtoken`), `bcryptjs`, `multer` (avatar uploads), `google-auth-library`
- **Frontend:** React 19, Vite, React Router, Tailwind CSS, Recharts, Lucide icons, Axios
- **Dataset:** MyFoodData / USDA Nutrition Facts Spreadsheet (14,164 foods)
