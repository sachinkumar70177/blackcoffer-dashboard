// Loads backend/data/jsondata.json into the MongoDB "insights" collection.
// Usage:  npm run seed   (make sure .env / MONGO_URI is set and Mongo is running)

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Insight = require('./models/Insight');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blackcoffer';
const DATA_PATH = path.join(__dirname, 'data', 'jsondata.json');

function cleanNumber(val) {
  if (val === '' || val === null || val === undefined) return 0;
  const n = Number(val);
  return Number.isNaN(n) ? 0 : n;
}

async function seed() {
  console.log('Connecting to', MONGO_URI);
  await mongoose.connect(MONGO_URI);

  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const records = JSON.parse(raw);

  const docs = records.map((r) => ({
    end_year: r.end_year === '' ? null : r.end_year,
    start_year: r.start_year === '' ? null : r.start_year,
    intensity: cleanNumber(r.intensity),
    likelihood: cleanNumber(r.likelihood),
    relevance: cleanNumber(r.relevance),
    impact: r.impact === '' ? null : r.impact,
    sector: r.sector || '',
    topic: r.topic || '',
    insight: r.insight || '',
    url: r.url || '',
    region: r.region || '',
    country: r.country || '',
    city: r.city || '',
    pestle: r.pestle || '',
    source: r.source || '',
    swot: r.swot || '',
    title: r.title || '',
    added: r.added || '',
    published: r.published || '',
  }));

  console.log(`Clearing existing "insights" collection...`);
  await Insight.deleteMany({});

  console.log(`Inserting ${docs.length} records...`);
  await Insight.insertMany(docs);

  console.log('Done seeding database.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
