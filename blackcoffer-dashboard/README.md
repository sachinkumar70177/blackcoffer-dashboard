# Blackcoffer Insights Dashboard

A full-stack data visualization dashboard built for the Blackcoffer test assignment.

- **Frontend:** React (Create React App) + Recharts + react-select
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas free tier)
- **Data:** the assignment's `jsondata.json`

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Step 1 — Create a Free MongoDB Atlas Cluster](#step-1--create-a-free-mongodb-atlas-cluster)
4. [Step 2 — Configure the Backend](#step-2--configure-the-backend)
5. [Step 3 — Seed the Database](#step-3--seed-the-database)
6. [Step 4 — Run the Backend API](#step-4--run-the-backend-api)
7. [Step 5 — Run the Frontend](#step-5--run-the-frontend)
8. [API Reference](#api-reference)
9. [Dashboard Features](#dashboard-features)
10. [Using Your Full Dataset](#using-your-full-dataset)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
blackcoffer-dashboard/
├── backend/
│   ├── data/jsondata.json     ← sample data (swap in the full assignment file)
│   ├── models/Insight.js      ← Mongoose schema
│   ├── routes/insights.js     ← REST API (list / filters / stats)
│   ├── seed.js                ← loads jsondata.json into MongoDB
│   ├── server.js              ← Express app entry point
│   ├── .env.example           ← copy to .env and fill in your MongoDB URI
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api.js               ← talks to the backend API
    │   ├── App.js                ← router shell (react-router-dom)
    │   ├── index.js / index.css  ← shared global reset
    │   ├── dashboard.css         ← styles for the dashboard route only
    │   ├── pages/
    │   │   ├── Landing.jsx / Landing.css  ← marketing landing page ("/")
    │   │   └── Dashboard.jsx              ← the data dashboard ("/dashboard")
    │   └── components/
    │       ├── FilterBar.jsx     ← all dashboard filters
    │       └── Charts.jsx        ← all chart components (Recharts)
    └── package.json
```

The frontend is a single React app with two routes, wired up with `react-router-dom`:

| Route        | Page                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| `/`          | Landing page — product marketing page with a "Launch dashboard" button/tile |
| `/dashboard` | The actual data dashboard (filters + charts)                                |

Clicking **"Launch dashboard"** anywhere on the landing page uses a React Router `<Link to="/dashboard">` — it's a client-side navigation, not an external redirect, so it works identically in dev and after deployment with no extra configuration.

## Prerequisites

- [Node.js](https://nodejs.org) v18 or later (includes `npm`)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account (no credit card required)

---

## Step 1 — Create a Free MongoDB Atlas Cluster

1. Go to https://cloud.mongodb.com and log in.
2. Create a new **Project** (any name, e.g. `Blackcoffer`).
3. Click **Build a Database** → choose the **M0 Free** tier → pick any cloud provider/region → **Create**.
   (Free forever — 500MB storage, more than enough for this dataset.)
4. **Database Access** (left sidebar) → **Add New Database User**:
   - Username: e.g. `blackcoffer_user`
   - Password: click **Autogenerate Secure Password** (avoid `@` or `/` if you type your own)
   - **Copy the password now** — it's shown only once
   - Privileges: **Read and write to any database**
5. **Network Access** (left sidebar) → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**.
6. **Database** → your cluster → **Connect** → **Drivers** → select **Node.js**.
7. Copy the connection string shown:
   ```
   mongodb+srv://blackcoffer_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your real password, and add a database name `blackcoffer` right after `.net/`:
   ```
   mongodb+srv://blackcoffer_user:yourpassword@cluster0.xxxxx.mongodb.net/blackcoffer?retryWrites=true&w=majority
   ```
   Keep this string handy for the next step.

---

## Step 2 — Configure the Backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and paste your connection string:

```
MONGO_URI=mongodb+srv://blackcoffer_user:yourpassword@cluster0.xxxxx.mongodb.net/blackcoffer?retryWrites=true&w=majority
PORT=5000
```

Install dependencies:

```bash
npm install
```

---

## Step 3 — Seed the Database

This loads `data/jsondata.json` into your Atlas cluster:

```bash
npm run seed
```

Expected output:

```
Connecting to mongodb+srv://...
Clearing existing "insights" collection...
Inserting 59 records...
Done seeding database.
```

**Verify it worked:** in Atlas, go to **Database → Browse Collections** — you should see a `blackcoffer` database with an `insights` collection full of records.

---

## Step 4 — Run the Backend API

```bash
npm start
```

You should see:

```
MongoDB connected: mongodb+srv://...
API server running on http://localhost:5000
```

Quick check:

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/insights/filters
```

Keep this terminal running.

---

## Step 5 — Run the Frontend

In a **new terminal tab**:

```bash
cd frontend
npm install
npm start
```

This opens `http://localhost:3000` automatically. The dashboard fetches live data from your Express API, which reads from MongoDB Atlas.

---

## API Reference

| Endpoint                    | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| `GET /api/health`           | Health check                                                                 |
| `GET /api/insights`         | Filtered list of raw records (`?limit=` caps results, default 500, max 5000) |
| `GET /api/insights/filters` | Distinct values for every filter field, used to populate dropdowns           |
| `GET /api/insights/stats`   | Pre-aggregated data for the charts — respects the same filters               |

All filter fields accept comma-separated values for multi-select:

```
GET /api/insights/stats?topic=oil,gas&region=Northern%20America&intensity_min=10
```

Filterable fields: `end_year`, `topic`, `sector`, `region`, `pestle`, `source`, `swot`, `country`, `city`.
Numeric range filters: `intensity_min`/`intensity_max`, `likelihood_min`/`likelihood_max`, `relevance_min`/`relevance_max`.

---

## Dashboard Features

- **KPI row:** total records, average intensity / likelihood / relevance for the current filter selection.
- **Charts (Recharts):**
  - Avg intensity / likelihood / relevance by topic (grouped bar)
  - Records by region (pie)
  - Records by PEST(LE) category (horizontal bar)
  - Sector: volume vs avg relevance (grouped bar)
  - Top countries by record count (bar)
  - Trend by end year (line)
  - Topic profile (radar, top 8 topics)
  - Intensity vs likelihood bubble scatter (bubble size = relevance)
- **Filters (all combinable, multi-select):** End Year, Topic, Sector, Region, PEST(LE), Source, SWOT, Country, City, plus numeric range filters for Intensity, Likelihood, and Relevance.

---

## Using Your Full Dataset

`backend/data/jsondata.json` ships with a small sample so the app runs correctly out of the box. To use the full assignment dataset (~1,000 records):

1. Replace `backend/data/jsondata.json` with the full file (same JSON shape).
2. Re-run the seed script:
   ```bash
   cd backend
   npm run seed
   ```
3. No other code changes are needed — filters and charts pick up new values automatically (they're computed from `Insight.distinct()` and MongoDB aggregations, not hardcoded).

> Note: the source data has no `city` or `swot` fields. The schema, API, and UI already support them (per the assignment brief), so if a future version of your dataset includes them, they'll appear automatically — until then those filters will simply be empty.

---

## Deployment

### 1. MongoDB

Already covered above — Atlas free tier works as-is for deployment too. No changes needed; just make sure Network Access still allows `0.0.0.0/0` so your hosted backend can reach it.

### 2. Backend (Render or Railway — both free tiers available)

**Render:**

1. Push `backend/` to a GitHub repo.
2. https://render.com → New → Web Service → connect your repo.
3. Root directory: `backend` · Build command: `npm install` · Start command: `npm start`
4. Add environment variables:
   ```
   MONGO_URI = <your Atlas connection string>
   PORT = 10000
   ```
5. Deploy. You'll get a URL like `https://blackcoffer-backend.onrender.com`.
6. Run the seed once via Render's Shell tab: `npm run seed`.

### 3. Frontend (Vercel or Netlify)

**Vercel:**

1. Push `frontend/` to GitHub.
2. https://vercel.com → New Project → import repo → Root Directory: `frontend` (Create React App auto-detected).
3. Add environment variable:
   ```
   REACT_APP_API_BASE = https://blackcoffer-backend.onrender.com
   ```
4. Deploy. You'll get a URL like `https://blackcoffer-dashboard.vercel.app`.

### Connection flow

```
React (Vercel)  →  REACT_APP_API_BASE  →  Express API (Render)  →  MONGO_URI  →  MongoDB Atlas
```

Neither `MONGO_URI` nor `REACT_APP_API_BASE` should be committed to git — set them as environment variables on the hosting platform only.

---

## Troubleshooting

| Problem                                                  | Likely cause                                                                                                                 |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm run seed` fails to connect                          | Wrong password in `MONGO_URI`, or Network Access doesn't allow your IP (Atlas → Network Access)                              |
| Seed connects but throws auth error                      | Typo in username/password, or password contains an unescaped special character (e.g. `@` → `%40`)                            |
| Frontend loads but shows "Could not load dashboard data" | Backend isn't running, or `REACT_APP_API_BASE`/proxy isn't pointing at the right backend URL                                 |
| Filters are empty                                        | Run `npm run seed` before `npm start` on the backend                                                                         |
| Charts show but look sparse                              | You're using the sample dataset — swap in the full `jsondata.json` (see [Using Your Full Dataset](#using-your-full-dataset)) |
