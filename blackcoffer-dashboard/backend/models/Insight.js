const mongoose = require('mongoose');

// Schema mirrors the fields present in jsondata.json.
// Numeric-but-sometimes-empty-string fields are stored permissively (Mixed)
// so the same import script works whether the source value is "" or a number.
const InsightSchema = new mongoose.Schema(
  {
    end_year: { type: mongoose.Schema.Types.Mixed, default: null },
    start_year: { type: mongoose.Schema.Types.Mixed, default: null },
    intensity: { type: Number, default: 0 },
    likelihood: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
    impact: { type: mongoose.Schema.Types.Mixed, default: null },
    sector: { type: String, default: '', index: true },
    topic: { type: String, default: '', index: true },
    insight: { type: String, default: '' },
    url: { type: String, default: '' },
    region: { type: String, default: '', index: true },
    country: { type: String, default: '', index: true },
    city: { type: String, default: '', index: true }, // not present in source data but supported
    pestle: { type: String, default: '', index: true }, // PEST(LE) category
    source: { type: String, default: '', index: true },
    swot: { type: String, default: '', index: true }, // Strength/Weakness/Opportunity/Threat, if present
    title: { type: String, default: '' },
    added: { type: String, default: '' },
    published: { type: String, default: '' },
  },
  { collection: 'insights', timestamps: true }
);

module.exports = mongoose.model('Insight', InsightSchema);
