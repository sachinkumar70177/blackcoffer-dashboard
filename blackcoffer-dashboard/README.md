# Blackcoffer Insights Dashboard

A full-stack data visualization dashboard for the Blackcoffer test assignment.

- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Frontend:** React (Create React App) + Recharts + react-select
- **Data:** the assignment's `jsondata.json`, loaded into MongoDB via a seed script

## Project structure

```
blackcoffer-dashboard/
├── backend/
│   ├── data/jsondata.json     ← sample data (see note below)
│   ├── models/Insight.js      ← Mongoose schema
│   ├── routes/insights.js     ← REST API (list / filters / stats)
│   ├── seed.js                ← loads jsondata.json into MongoDB
│   ├── server.js              ← Express app entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api.js
    │   ├── App.js
    │   ├── index.js / index.css
    │   └── components/
    │       ├── FilterBar.jsx
    │       └── Charts.jsx
    └── package.json
```

## ⚠️ About the data file

`backend/data/jsondata.json` ships with a **~60-record sample** drawn from the
assignment's dataset, so the app runs and looks correct out of the box.

**Replace this file with the assignment's full `jsondata.json`** (it has
~1,000 records) before you submit, then re-run the seed script. No code
changes are needed — the seed script and API work with any size of the same
JSON shape.

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env        # edit MONGO_URI if needed
```

Make sure MongoDB is running locally (`mongod`) or point `MONGO_URI` in `.env`
at a MongoDB Atlas cluster.

Load the data into MongoDB:

```bash
npm run seed
```

Start the API server:

```bash
npm start          # or: npm run dev  (with nodemon)
```

The API will be available at `http://localhost:5000/api`:

| Endpoint | Description |
|---|---|
| `GET /api/insights` | Filtered list of raw records |
| `GET /api/insights/filters` | Distinct values for every filter (topic, sector, region, pestle, source, swot, country, city, end_year) |
| `GET /api/insights/stats` | Pre-aggregated data for the charts (respects the same filters) |

All filter fields accept comma-separated values for multi-select, e.g.:

```
GET /api/insights/stats?topic=oil,gas&region=Northern%20America&intensity_min=10
```

## 2. Frontend setup

```bash
cd frontend
npm install
npm start
```

Opens at `http://localhost:3000`. In development, CRA's `proxy` setting in
`package.json` forwards `/api/*` calls to `http://localhost:5000`, so no CORS
config is needed. For a production build pointed at a different API host, set
`REACT_APP_API_BASE` in a `.env` file inside `frontend/`.

## Dashboard features

- **KPI row:** total records, average intensity / likelihood / relevance for
  the current filter selection.
- **Charts (Recharts):**
  - Avg intensity / likelihood / relevance by topic (grouped bar)
  - Records by region (pie)
  - Records by PEST(LE) category (horizontal bar)
  - Sector: volume vs avg relevance (grouped bar)
  - Top countries by record count (bar)
  - Trend by end year (line)
  - Topic profile (radar, top 8 topics)
  - Intensity vs likelihood bubble scatter (bubble size = relevance)
- **Filters (multi-select, all combinable):** End Year, Topic, Sector, Region,
  PEST(LE), Source, SWOT, Country, City, plus numeric range filters for
  Intensity, Likelihood and Relevance.

> Note: the source JSON has no `city` or `swot` fields, so those filters and
> their dropdowns will simply be empty unless your full dataset (or a future
> version of it) includes them — the schema, seed script and API already
> support them so nothing else needs to change if the data appears later.

## Notes on scaling to the full dataset

- `GET /api/insights` is capped at 5,000 records per request (`limit` query
  param, default 500) to keep responses fast; the dashboard's charts use the
  `/stats` endpoint, which aggregates in MongoDB rather than in the browser,
  so it stays fast even with the full ~1,000-row dataset.
- All filter dropdowns come from `Insight.distinct(field)`, so as soon as you
  reseed with the full file, new values (e.g., additional countries or
  topics) show up automatically — no frontend changes required.
